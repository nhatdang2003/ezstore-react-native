import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    Image,
    Modal,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, isToday, isYesterday } from 'date-fns';
import { COLOR } from '@/src/constants/color';
import { useRouter } from 'expo-router';

// Types
type NotificationType = 'promotion' | 'order';

interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: Date;
    type: NotificationType;
    read: boolean;
}

// Dữ liệu mẫu
const SAMPLE_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'Khuyến mãi hè!',
        message: 'Giảm 50% cho tất cả sản phẩm mùa hè. Ưu đãi có thời hạn!',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 phút trước
        type: 'promotion',
        read: false,
    },
    {
        id: '2',
        title: 'Đơn hàng #ORD-12345678901239 đã được gửi đi',
        message: 'Đơn hàng của bạn đã được gửi đi và sẽ đến trong 2-3 ngày làm việc.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 phút trước
        type: 'order',
        read: false,
    },
    {
        id: '3',
        title: 'Bộ sưu tập mới đã ra mắt',
        message: 'Khám phá bộ sưu tập mùa thu mới với các thiết kế độc quyền!',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 giờ trước
        type: 'promotion',
        read: true,
    },
    {
        id: '4',
        title: 'Đơn hàng #12346 đã được giao',
        message: 'Đơn hàng của bạn đã được giao. Chúc bạn hài lòng với sản phẩm!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 ngày trước
        type: 'order',
        read: true,
    },
    {
        id: '5',
        title: 'Khuyến mãi cuối tuần',
        message: 'Đừng bỏ lỡ khuyến mãi cuối tuần với giảm giá lên đến 70%!',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 ngày trước
        type: 'promotion',
        read: true,
    },
    {
        id: '6',
        title: 'Đơn hàng #12347 đã được xác nhận',
        message: 'Đơn hàng của bạn đã được xác nhận và đang được xử lý.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 ngày trước
        type: 'order',
        read: true,
    },
];

// Hàm hỗ trợ định dạng thời gian
const formatTimestamp = (date: Date) => {
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
    const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Giả lập tải dữ liệu mới
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    }, []);

    const handleNotificationPress = (notification: Notification) => {
        // Đánh dấu là đã đọc
        setNotifications(prev =>
            prev.map(item =>
                item.id === notification.id ? { ...item, read: true } : item
            )
        );
        // if (type==='ORDER_STATUS_UPDATED')
        router.push(`/notification/promo_campaign`);
    };

    const renderNotificationItem = ({ item }: { item: Notification }) => {
        const typeColor = item.type === 'promotion' ? '#9C27B0' : '#2196F3';
        const typeIcon = item.type === 'promotion' ? 'gift-outline' : 'cube-outline';

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
                            <Text style={[styles.notificationTitle, !item.read && styles.boldText]}>
                                {item.title}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.notificationMessage}>{item.message}</Text>
                    <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
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

    return (
        <SafeAreaView style={styles.container}>
            {notifications.length > 0 ? (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())}
                    renderItem={renderNotificationItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    modalTimestamp: {
        fontSize: 14,
        color: '#9e9e9e',
        marginVertical: 8,
    },
    modalMessage: {
        fontSize: 16,
        color: '#212121',
        marginTop: 16,
        lineHeight: 24,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
});

export default NotificationScreen;