import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Modal, Dimensions, FlatList } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons'
import { Video, ResizeMode } from 'expo-av'
import { FONT } from '@/src/constants/font'
import { getProductReviews } from '@/src/services/product.service'
import { formatDate } from '@/src/utils/date'
import { ProductReview } from '@/src/types/product.type'
import MediaViewer, { MediaItem } from '@/src/components/MediaViewer'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const ReviewsProductScreen = () => {
    const router = useRouter()
    const { slug } = useLocalSearchParams()
    const flatListRef = useRef<FlatList>(null)

    const [activeFilter, setActiveFilter] = useState<number | null>(null)
    const [reviews, setReviews] = useState<ProductReview[]>([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null)
    const [currentReviewMedia, setCurrentReviewMedia] = useState<MediaItem[]>([])
    const PAGE_SIZE = 10

    useEffect(() => {
        fetchReviews()
    }, [activeFilter])

    const fetchReviews = async (refresh = true) => {
        if (loading || !slug) return

        try {
            setLoading(true)
            const pageToFetch = refresh ? 0 : page

            const response = await getProductReviews({
                slug: slug as string,
                rating: activeFilter !== null ? activeFilter : undefined,
                page: pageToFetch,
                pageSize: PAGE_SIZE
            })

            const responseData = response.data
            const newReviews = responseData.data || []

            if (refresh) {
                setReviews(newReviews)
                setPage(0)
            } else {
                setReviews([...reviews, ...newReviews])
                setPage(pageToFetch + 1)
            }

            const totalPages = responseData.meta?.pages || 1
            const currentPageNumber = responseData.meta?.page || 0
            setHasMore(currentPageNumber < totalPages - 1)
        } catch (error) {
            console.error('Error fetching reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadMoreReviews = () => {
        if (!loading && hasMore) {
            fetchReviews(false)
        }
    }

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <AntDesign key={`star-${i}`} name="star" size={14} color="#FFD700" />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <AntDesign key="half-star" name="staro" size={14} color="#FFD700" />
            );
        }

        const remainingStars = 5 - stars.length;
        for (let i = 0; i < remainingStars; i++) {
            stars.push(
                <AntDesign
                    key={`empty-star-${i}`}
                    name="staro"
                    size={14}
                    color="#FFD700"
                />
            );
        }

        return stars;
    };

    // Handle filter selection
    const handleFilterSelect = (stars: number | null) => {
        setActiveFilter(stars === activeFilter ? null : stars)
    }

    const openMediaViewer = (review: ProductReview, initialIndex: number) => {
        const mediaItems: MediaItem[] = [
            ...(review.imageUrls?.map(url => ({ type: 'image' as const, url })) || []),
            ...(review.videoUrl ? [{ type: 'video' as const, url: review.videoUrl }] : [])
        ];
        setCurrentReviewMedia(mediaItems);
        setSelectedMediaIndex(initialIndex);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đánh giá</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Star Filters */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterButton, activeFilter === null && styles.activeFilterButton]}
                    onPress={() => handleFilterSelect(null)}
                >
                    <Text style={[styles.filterText, activeFilter === null && styles.activeFilterText]}>Tất cả</Text>
                </TouchableOpacity>

                {[5, 4, 3, 2, 1].map((stars) => (
                    <TouchableOpacity
                        key={`filter-${stars}`}
                        style={[styles.filterButton, activeFilter === stars && styles.activeFilterButton]}
                        onPress={() => handleFilterSelect(stars)}
                    >
                        <Text style={[styles.filterText, activeFilter === stars && styles.activeFilterText]}>
                            {stars} <AntDesign name="star" size={12} color={activeFilter === stars ? "#fff" : "#FFD700"} />
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
                onScroll={({ nativeEvent }) => {
                    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent
                    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
                    if (isCloseToBottom) {
                        loadMoreReviews()
                    }
                }}
                scrollEventThrottle={400}
            >
                {loading && page === 0 && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FFD700" />
                    </View>
                )}

                {!loading && reviews.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Chưa có đánh giá nào</Text>
                    </View>
                )}

                {reviews.length > 0 && (
                    reviews.map((review, index) => (
                        <React.Fragment key={`review-${review.reviewId || index}`}>
                            <View style={styles.reviewItem}>
                                <View style={styles.reviewHeader}>
                                    <View style={styles.userInfo}>
                                        {review.avatar ? (
                                            <Image
                                                source={{ uri: review.avatar }}
                                                style={styles.userAvatar}
                                            />
                                        ) : (
                                            <View style={styles.userAvatar}>
                                                <FontAwesome name="user" size={14} color="#666" />
                                            </View>
                                        )}
                                        <Text style={styles.username}>
                                            {review.firstName && review.lastName
                                                ? `${review.firstName} ${review.lastName}`
                                                : 'Người dùng ẩn danh'}
                                        </Text>
                                    </View>
                                    <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
                                </View>
                                <View style={styles.ratingStars}>
                                    {renderStars(review.rating)}
                                </View>
                                {review.variant && (
                                    <Text style={styles.variantInfo}>
                                        {`Màu ${review.variant.color}, size ${review.variant.size}`}
                                    </Text>
                                )}
                                <Text style={styles.reviewContent}>
                                    {review.description}
                                </Text>

                                {/* Media Section */}
                                {(review.imageUrls?.length > 0 || review.videoUrl) && (
                                    <View style={styles.mediaContainer}>
                                        <MediaViewer 
                                            mediaItems={[
                                                ...(review.imageUrls?.map(url => ({ type: 'image' as const, url })) || []),
                                                ...(review.videoUrl ? [{ type: 'video' as const, url: review.videoUrl }] : [])
                                            ]} 
                                        />
                                    </View>
                                )}
                            </View>
                            {index < reviews.length - 1 && <View style={styles.divider} />}
                        </React.Fragment>
                    ))
                )}

                {loading && page > 0 && (
                    <View style={styles.loadingMoreContainer}>
                        <ActivityIndicator size="small" color="#FFD700" />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontFamily: FONT.LORA_MEDIUM,
        fontSize: 18,
    },
    placeholder: {
        width: 24,
    },
    scrollView: {
        paddingHorizontal: 16,
    },
    reviewItem: {
        gap: 6,
        marginVertical: 12,
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    userAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: "#ddd",
        justifyContent: 'center',
        alignItems: 'center',
    },
    username: {
        fontWeight: "500",
    },
    reviewDate: {
        color: "#999",
    },
    ratingStars: {
        flexDirection: "row",
        alignItems: "center",
    },
    variantInfo: {
        color: "#999",
    },
    reviewContent: {
        color: "#333",
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#E0E0E0",
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    activeFilterButton: {
        backgroundColor: "#FFD700",
        borderColor: "#FFD700",
    },
    filterText: {
        fontSize: 14,
        color: "#333",
    },
    activeFilterText: {
        color: "#fff",
    },
    loadingContainer: {
        paddingVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingMoreContainer: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        fontFamily: FONT.LORA,
    },
    mediaContainer: {
        marginTop: 8,
    },
})

export default ReviewsProductScreen