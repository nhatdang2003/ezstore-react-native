import { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView, Modal, Dimensions, FlatList } from "react-native";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { FONT } from "@/src/constants/font";
import { router, useLocalSearchParams } from "expo-router";
import { COLOR } from "@/src/constants/color";
import { getOrderReviews } from "@/src/services/order.service";
import { OrderReviewResponse } from "@/src/types/review.type";
import { formatDateString } from "@/src/utils/date";
import { Video, ResizeMode } from 'expo-av';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MediaItem {
    type: 'image' | 'video';
    url: string;
}

export default function ReviewScreen() {
    const { orderId } = useLocalSearchParams();
    const [reviews, setReviews] = useState<OrderReviewResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
    const [currentReviewMedia, setCurrentReviewMedia] = useState<MediaItem[]>([]);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!orderId) {
                setError("Không tìm thấy thông tin đơn hàng");
                setLoading(false);
                return;
            }

            try {
                const response = await getOrderReviews(Number(orderId));
                setReviews(response.data);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setError("Có lỗi khi tải đánh giá");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [orderId]);

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, index) => (
            <Ionicons
                key={index}
                name="star"
                size={16}
                color={index < rating ? "#FFD700" : "#DDDDDD"}
            />
        ));
    };

    const openMediaViewer = (review: OrderReviewResponse, initialIndex: number) => {
        const mediaItems: MediaItem[] = [
            ...(review.imageUrls?.map(url => ({ type: 'image' as const, url })) || []),
            ...(review.videoUrl ? [{ type: 'video' as const, url: review.videoUrl }] : [])
        ];
        setCurrentReviewMedia(mediaItems);
        setSelectedMediaIndex(initialIndex);
    };

    const renderMediaItem = ({ item }: { item: MediaItem }) => (
        <View style={styles.fullScreenMediaContainer}>
            {item.type === 'video' ? (
                <Video
                    source={{ uri: item.url }}
                    style={styles.fullScreenVideo}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={false}
                />
            ) : (
                <Image
                    source={{ uri: item.url }}
                    style={styles.fullScreenImage}
                    resizeMode="contain"
                />
            )}
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.headerTab}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <SimpleLineIcons name="arrow-left" size={20} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Đánh giá đơn hàng</Text>
                    <View />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLOR.PRIMARY} />
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.headerTab}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <SimpleLineIcons name="arrow-left" size={20} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Đánh giá đơn hàng</Text>
                    <View />
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerTab}>
                <TouchableOpacity onPress={() => router.back()}>
                    <SimpleLineIcons name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đánh giá đơn hàng</Text>
                <View />
            </View>

            <ScrollView style={styles.content}>
                {reviews.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Không có đánh giá nào cho đơn hàng này</Text>
                    </View>
                ) : (
                    reviews.map((review, index) => (
                        <View key={index} style={styles.reviewContainer}>
                            <View style={styles.reviewHeader}>
                                <View style={styles.userInfo}>
                                    <Image
                                        source={{ uri: review.avatar || "/placeholder.svg?height=40&width=40" }}
                                        style={styles.avatar}
                                    />
                                    <View>
                                        <Text style={styles.username}>
                                            {review.firstName} {review.lastName}
                                        </Text>
                                        <View style={styles.ratingContainer}>
                                            {renderStars(review.rating)}
                                        </View>
                                        <View>
                                            <Text numberOfLines={4} style={styles.reviewText}>
                                                {review.description}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.editButton}>
                                    <Text style={styles.editButtonText}
                                        onPress={() => {
                                            router.replace(`/account/reviews?orderId=${orderId}&lineItemId=${review.lineItemId}&mode=edit`)
                                        }}>Sửa</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.date}>
                                {review.createdAt ? formatDateString(review.createdAt) : ''}
                            </Text>

                            {/* Media Section */}
                            {(review.imageUrls?.length > 0 || review.videoUrl) && (
                                <View style={styles.mediaContainer}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {review.imageUrls?.map((imageUrl, imgIndex) => (
                                            <TouchableOpacity
                                                key={`img-${imgIndex}`}
                                                onPress={() => openMediaViewer(review, imgIndex)}
                                            >
                                                <Image
                                                    source={{ uri: imageUrl }}
                                                    style={styles.mediaImage}
                                                />
                                            </TouchableOpacity>
                                        ))}
                                        {review.videoUrl && (
                                            <TouchableOpacity
                                                onPress={() => openMediaViewer(review, review.imageUrls?.length || 0)}
                                            >
                                                <View style={styles.videoContainer}>
                                                    <Video
                                                        source={{ uri: review.videoUrl }}
                                                        style={styles.mediaVideo}
                                                        useNativeControls
                                                        resizeMode={ResizeMode.COVER}
                                                        shouldPlay={false}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    </ScrollView>
                                </View>
                            )}

                            <View style={styles.productContainer}>
                                <Image
                                    source={{ uri: review.variantImage || "/placeholder.svg?height=80&width=80" }}
                                    style={styles.productImage}
                                />
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName} numberOfLines={2}>
                                        {review.productName}
                                    </Text>
                                    {(review.color || review.size) && (
                                        <Text style={styles.productVariant}>
                                            {review.color} {review.size}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Fullscreen Media Modal */}
            <Modal
                visible={selectedMediaIndex !== null}
                transparent={true}
                onRequestClose={() => setSelectedMediaIndex(null)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setSelectedMediaIndex(null)}
                    >
                        <Ionicons name="close" size={28} color="white" />
                    </TouchableOpacity>

                    <View style={styles.mediaCountContainer}>
                        <Text style={styles.mediaCountText}>
                            {selectedMediaIndex !== null ? `${selectedMediaIndex + 1}/${currentReviewMedia.length}` : ''}
                        </Text>
                    </View>

                    <FlatList
                        ref={flatListRef}
                        data={currentReviewMedia}
                        renderItem={renderMediaItem}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        initialScrollIndex={selectedMediaIndex || 0}
                        getItemLayout={(data, index) => ({
                            length: screenWidth,
                            offset: screenWidth * index,
                            index,
                        })}
                        onScroll={e => {
                            const newIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                            setSelectedMediaIndex(newIndex);
                        }}
                        scrollEventThrottle={16}
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.BACKGROUND,
    },
    headerTab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#FFF',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: FONT.LORA_MEDIUM,
    },
    backButton: {
        padding: 4,
    },
    placeholder: {
        width: 24,
    },
    content: {
        flex: 1,
    },
    reviewContainer: {
        marginTop: 8,
        padding: 16,
        backgroundColor: '#fff'
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    userInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    username: {
        fontSize: 16,
        fontWeight: "500",
    },
    editButton: {
        borderWidth: 1,
        borderColor: COLOR.PRIMARY,
        borderRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    editButtonText: {
        color: COLOR.PRIMARY,
    },
    ratingContainer: {
        flexDirection: "row",
        marginVertical: 8,
    },
    date: {
        color: "#888",
        fontSize: 14,
        marginBottom: 16,
    },
    reviewText: {
        color: "#333",
        lineHeight: 20,
    },
    responseContainer: {
        backgroundColor: "#F8F8F8",
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    responseTitle: {
        fontWeight: "600",
        marginBottom: 8,
    },
    responseText: {
        color: "#555",
        marginBottom: 4,
        lineHeight: 20,
    },
    productContainer: {
        flexDirection: "row",
        backgroundColor: "#F8F8F8",
        padding: 12,
        borderRadius: 8,
        alignItems: "flex-start",
    },
    productImage: {
        width: 60,
        height: 80,
        borderRadius: 4,
        marginRight: 12,
    },
    productName: {
        flex: 1,
        fontSize: 15,
        fontWeight: "500",
        marginBottom: 4,
    },
    productVariant: {
        fontSize: 14,
        color: "#666",
    },
    productInfo: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    mediaContainer: {
        marginBottom: 16,
    },
    mediaImage: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginRight: 8,
    },
    videoContainer: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginRight: 8,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    mediaVideo: {
        width: '100%',
        height: '100%',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    fullScreenMediaContainer: {
        width: screenWidth,
        height: screenHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        width: screenWidth,
        height: screenHeight,
    },
    fullScreenVideo: {
        width: screenWidth,
        height: screenWidth * (9/16), // 16:9 aspect ratio
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
        padding: 10,
    },
    mediaCountContainer: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
        padding: 10,
    },
    mediaCountText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
})

