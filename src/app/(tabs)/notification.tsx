import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { COLOR } from '@/src/constants/color';
import { useFocusEffect, useRouter } from 'expo-router';
import { getNotifications, markReadNotification } from '@/src/services/notification.service';
import { Notification } from '@/src/types/notification.type';
import { useNotificationStore } from '@/src/store/notificationStore';

// Hàm hỗ trợ định dạng thời gian
const formatTimestamp = (dateString: string) => {
    const date = parseISO(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    if (isToday(date)) return `Hôm nay lúc ${format(date, 'HH:mm')}`;
    if (isYesterday(date)) return `Hôm qua lúc ${format(date, 'HH:mm')}`;

    return format(date, 'dd/MM/yyyy HH:mm');
};

const NotificationScreen = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const setUnreadCount = useNotificationStore(state => state.setUnreadCount);
    const decrementUnreadCount = useNotificationStore(state => state.decrementUnreadCount);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await getNotifications();
            if (response.statusCode === 200) {
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.unreadCount);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    const handleNotificationPress = async (notification: Notification) => {
        try {
            // Only mark as read if not already read
            if (!notification.read) {
                await markReadNotification(notification.id);
                // Update local state
                setNotifications(prev =>
                    prev.map(item =>
                        item.id === notification.id ? { ...item, read: true } : item
                    )
                );
                // Decrement unread count
                decrementUnreadCount();
            }

            // Navigate based on notification type
            if (notification.type === 'ORDER_STATUS_UPDATED' && notification.referenceId) {
                router.navigate({
                    pathname: "/account/order_details",
                    params: { orderId: notification.referenceId }
                });
            } else if (notification.type === 'PROMOTION_NOTIFICATION') {
                router.navigate(`/notification/promo_campaign`);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const renderNotificationItem = ({ item }: { item: Notification }) => {
        const typeColor = item.type === 'PROMOTION_NOTIFICATION' ? '#9C27B0' : '#2196F3';
        const typeIcon = item.type === 'PROMOTION_NOTIFICATION' ? 'gift-outline' : 'cube-outline';

        return (
            <TouchableOpacity
                style={[
                    styles.notificationItem,
                    !item.read && styles.unreadNotification
                ]}
                onPress={() => handleNotificationPress(item)}
            >
                <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                        <View style={styles.titleContainer}>
                            {!item.read && <View style={styles.unreadDot} />}
                            <Ionicons name={typeIcon} size={20} color={typeColor} style={styles.typeIcon} />
                            <Text style={[
                                styles.notificationTitle,
                                !item.read && styles.boldText
                            ]}>
                                {item.title}
                            </Text>
                        </View>
                    </View>
                    <Text style={[
                        styles.notificationMessage,
                        !item.read && styles.unreadMessage
                    ]}>
                        {item.content}
                    </Text>
                    <Text style={styles.timestamp}>{formatTimestamp(item.notificationDate)}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2748/2748558.png' }}
                style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>Chưa có thông báo nào</Text>
            <Text style={styles.emptyMessage}>
                Chúng tôi sẽ thông báo cho bạn khi có điều gì đó quan trọng xảy ra.
            </Text>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={COLOR.PRIMARY} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {notifications.length > 0 ? (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={notifications.sort((a, b) => new Date(b.notificationDate).getTime() - new Date(a.notificationDate).getTime())}
                    renderItem={renderNotificationItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListHeaderComponent={() => (
                        <View style={styles.listHeader}>
                            <Text style={styles.listHeaderText}>
                                {notifications.filter(n => !n.read).length} thông báo chưa đọc
                            </Text>
                        </View>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            ) : (
                renderEmptyState()
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContainer: {
        flexGrow: 1,
    },
    listHeader: {
        padding: 12,
        backgroundColor: '#f5f5f5',
    },
    listHeaderText: {
        fontSize: 14,
        color: '#757575',
    },
    notificationItem: {
        backgroundColor: '#fff',
        padding: 16,
    },
    unreadNotification: {
        backgroundColor: '#f0f7ff',
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2196F3',
        marginRight: 8,
    },
    typeIcon: {
        marginRight: 8,
    },
    notificationTitle: {
        fontSize: 16,
        color: COLOR.PRIMARY,
        flex: 1,
    },
    boldText: {
        fontWeight: 'bold',
    },
    typeTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    typeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    notificationMessage: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 8,
    },
    unreadMessage: {
        color: '#333333',
    },
    timestamp: {
        fontSize: 12,
        color: '#9e9e9e',
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    sectionHeader: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    sectionHeaderText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#616161',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyImage: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptyMessage: {
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
    },
});

export default NotificationScreen;