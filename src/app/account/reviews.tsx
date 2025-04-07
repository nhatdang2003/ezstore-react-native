import { useState, useEffect } from "react"
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Alert,
    ActivityIndicator,
} from "react-native"
import { Ionicons, FontAwesome, SimpleLineIcons } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"
import { FONT } from "@/src/constants/font"
import { COLOR } from "@/src/constants/color"
import { getOrderReviews, createOrderReview, updateOrderReview } from "@/src/services/order.service"
import { OrderReviewRequest, OrderReviewResponse } from "@/src/types/review.type"
import AlertDialog from "@/src/components/AlertModal"

export default function ProductReviewScreen() {
    const router = useRouter()
    const params = useLocalSearchParams()
    const [mediaFiles, setMediaFiles] = useState<Array<{
        type: 'image' | 'video',
        uri: string
    }>>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [orderReviews, setOrderReviews] = useState<OrderReviewResponse[]>([])
    const [showValidation, setShowValidation] = useState(false)
    const [alertVisible, setAlertVisible] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")

    // Store form data for each review item
    const [reviewsData, setReviewsData] = useState<{
        [key: number]: {
            rating: number;
            description: string;
        }
    }>({})

    const orderId = params.orderId ? Number(params.orderId) : 0
    const lineItemId = params.lineItemId ? Number(params.lineItemId) : undefined
    const mode = params.mode as string | undefined

    const isEditMode = mode === 'edit' && lineItemId !== undefined

    const getImagesCount = () => mediaFiles.filter(file => file.type === 'image').length
    const getVideoCount = () => mediaFiles.filter(file => file.type === 'video').length

    // Function to check if all reviews have valid data
    const areAllReviewsValid = () => {
        if (orderReviews.length === 0) return false;

        if (isEditMode && lineItemId !== undefined) {
            const review = reviewsData[lineItemId];
            return review && review.rating > 0 && review.description && review.description.trim().length >= 10;
        } else {
            // Check all items in create mode
            return orderReviews.every(review => {
                const data = reviewsData[review.lineItemId];
                return data && data.rating > 0 && data.description && data.description.trim().length >= 10;
            });
        }
    }

    // Check if a specific review is valid
    const isReviewValid = (lineItemId: number) => {
        const review = reviewsData[lineItemId];
        return review && review.rating > 0 && review.description && review.description.trim().length >= 10;
    }

    // Get validation message for a specific review
    const getValidationMessage = (lineItemId: number) => {
        const review = reviewsData[lineItemId];
        if (!review || !review.rating) return "* Vui lòng chọn số sao đánh giá";
        if (!review.description || review.description.trim().length < 10) {
            return `* Vui lòng viết nhận xét ít nhất 10 ký tự`;
        }
        return "";
    }

    useEffect(() => {
        if (orderId) {
            fetchOrderReviews(orderId)
        }
    }, [orderId])

    const fetchOrderReviews = async (id: number) => {
        try {
            setIsLoading(true)
            const response = await getOrderReviews(id)
            setOrderReviews(response.data)

            const initialReviewsData: { [key: number]: { rating: number; description: string } } = {};

            if (response.data && response.data.length > 0) {
                response.data.forEach(review => {
                    initialReviewsData[review.lineItemId] = {
                        rating: review.rating || 5,
                        description: review.description || ""
                    };
                });

                if (isEditMode && lineItemId) {
                    const reviewToEdit = response.data.find(review => review.lineItemId === lineItemId)
                    if (!reviewToEdit) {
                        Alert.alert("Lỗi", "Không tìm thấy thông tin sản phẩm cần sửa đánh giá")
                        router.back()
                    }
                }
            }

            setReviewsData(initialReviewsData);
        } catch (error) {
            console.error("Failed to fetch order reviews:", error)
            Alert.alert("Lỗi", "Không thể lấy dữ liệu đánh giá. Vui lòng thử lại sau")
        } finally {
            setIsLoading(false)
        }
    }

    const handleRatingChange = (lineItemId: number, rating: number) => {
        setReviewsData(prev => ({
            ...prev,
            [lineItemId]: {
                ...prev[lineItemId],
                rating
            }
        }));
    }

    const handleDescriptionChange = (lineItemId: number, description: string) => {
        setReviewsData(prev => ({
            ...prev,
            [lineItemId]: {
                ...prev[lineItemId],
                description
            }
        }));
    }

    const handleSubmitReview = async () => {
        setShowValidation(true);

        if (!areAllReviewsValid()) {
            setAlertMessage("Vui lòng điền đầy đủ thông tin đánh giá cho tất cả sản phẩm")
            setAlertVisible(true)
            return;
        }

        try {
            setIsSubmitting(true);

            if (isEditMode && lineItemId) {
                // Update existing review
                const reviewData = reviewsData[lineItemId];

                if (!reviewData) {
                    throw new Error("Không tìm thấy dữ liệu đánh giá");
                }

                const updateData: OrderReviewRequest = {
                    orderId,
                    reviewItem: {
                        lineItemId,
                        rating: reviewData.rating,
                        description: reviewData.description
                    }
                };

                await updateOrderReview(updateData);

                // Navigate back
                router.replace(`/account/list-review?orderId=${orderId}`);
            } else {
                // Create new review for each product
                const createPromises = Object.entries(reviewsData).map(([lineItemIdStr, reviewData]) => {
                    const createData: OrderReviewRequest = {
                        orderId,
                        reviewItem: {
                            lineItemId: parseInt(lineItemIdStr),
                            rating: reviewData.rating,
                            description: reviewData.description
                        }
                    };

                    return createOrderReview(createData);
                });

                await Promise.all(createPromises);

                // Navigate back
                router.replace(`/account/list-review?orderId=${orderId}`);
            }
        } catch (error) {
            console.error("Failed to submit review:", error);
            setAlertMessage("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
            setAlertVisible(true);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Calculate character count for a specific review
    const getCharacterCount = (lineItemId: number) => {
        return reviewsData[lineItemId]?.description?.length || 0;
    }

    // Keep existing useEffect, pickImages, pickVideo, removeMedia functions...
    // ...existing code...

    const renderStars = (count: number, activeCount: number, onPress: (rating: number) => void) => {
        return Array(count)
            .fill(0)
            .map((_, i) => (
                <TouchableOpacity key={i} onPress={() => onPress(i + 1)}>
                    <FontAwesome
                        name="star"
                        size={24}
                        color={i < activeCount ? "#FFB800" : "#E0E0E0"}
                        style={styles.star}
                    />
                </TouchableOpacity>
            ))
    }

    // Render a single review item
    const renderReviewItem = (review: OrderReviewResponse) => {
        const reviewData = reviewsData[review.lineItemId] || { rating: 5, description: "" };

        return (
            <View key={review.lineItemId} style={styles.productCard}>
                <View style={styles.productInfo}>
                    <Image
                        source={{ uri: review.variantImage || "https://via.placeholder.com/60" }}
                        style={styles.productImage}
                    />
                    <View style={styles.productDetails}>
                        <Text style={styles.productName}>{review.productName}</Text>
                        <Text style={styles.productVariant}>
                            {review.color} {review.size ? `- ${review.size}` : ''}
                        </Text>
                    </View>
                </View>

                <View style={styles.ratingSection}>
                    <Text style={styles.sectionTitle}>Đánh giá sản phẩm</Text>
                    <View style={styles.starsContainer}>
                        {renderStars(5, reviewData.rating, (rating) => handleRatingChange(review.lineItemId, rating))}
                    </View>
                </View>

                {/* Photo/Video Upload */}
                {/* <View style={styles.uploadSection}>
                    <Text style={styles.uploadTitle}>
                        Thêm ít nhất 1 hình ảnh/video về sản phẩm
                        <Text style={styles.bonusText}>
                            {" "}
                            +200 <FontAwesome name="circle" size={14} color="#FFB800" />
                        </Text>
                    </Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaPreviewScroll}>
                        {mediaFiles.map((file, index) => (
                            <View key={index} style={styles.mediaPreviewContainer}>
                                {file.type === 'image' ? (
                                    <Image source={{ uri: file.uri }} style={styles.mediaPreview} />
                                ) : (
                                    <Video
                                        source={{ uri: file.uri }}
                                        style={styles.mediaPreview}
                                        resizeMode={ResizeMode.COVER}
                                    />
                                )}
                                <TouchableOpacity
                                    style={styles.removeMediaButton}
                                    onPress={() => removeMedia(index)}
                                >
                                    <Ionicons name="close-circle" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.uploadOptions}>
                        <TouchableOpacity
                            style={[
                                styles.uploadOption,
                                getImagesCount() >= 5 && styles.uploadOptionDisabled
                            ]}
                            onPress={pickImages}
                            disabled={getImagesCount() >= 5}
                        >
                            <View style={styles.uploadIconContainer}>
                                <Ionicons name="images-outline" size={28} color={getImagesCount() >= 5 ? "#ccc" : "#555"} />
                            </View>
                            <Text style={[styles.uploadOptionText, getImagesCount() >= 5 && styles.uploadOptionTextDisabled]}>
                                Hình ảnh ({getImagesCount()}/5)
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.uploadOption,
                                getVideoCount() >= 1 && styles.uploadOptionDisabled
                            ]}
                            onPress={pickVideo}
                            disabled={getVideoCount() >= 1}
                        >
                            <View style={styles.uploadIconContainer}>
                                <Ionicons name="videocam-outline" size={28} color={getVideoCount() >= 1 ? "#ccc" : "#555"} />
                            </View>
                            <Text style={[styles.uploadOptionText, getVideoCount() >= 1 && styles.uploadOptionTextDisabled]}>
                                Video ({getVideoCount()}/1)
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View> */}

                <View style={styles.reviewTextSection}>
                    <Text style={styles.reviewTextTitle}>
                        Viết đánh giá từ 10 ký tự
                    </Text>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.textInput}
                            multiline
                            placeholder="Hãy chia sẻ nhận xét cho sản phẩm này bạn nhé!"
                            placeholderTextColor="#CCCCCC"
                            value={reviewData.description}
                            onChangeText={(text) => handleDescriptionChange(review.lineItemId, text)}
                        />
                        <Text style={styles.characterCount}>
                            {getCharacterCount(review.lineItemId)} ký tự
                        </Text>
                    </View>
                </View>

                {showValidation && !isReviewValid(review.lineItemId) && (
                    <Text style={styles.validationMessage}>
                        {getValidationMessage(review.lineItemId)}
                    </Text>
                )}
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.headerTab}>
                <TouchableOpacity onPress={() => router.back()}>
                    <SimpleLineIcons name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {isEditMode ? "Sửa đánh giá" : "Đánh giá đơn hàng"}
                </Text>
                <View />
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLOR.PRIMARY} />
                    <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
                </View>
            ) : orderReviews.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không có sản phẩm nào để đánh giá</Text>
                </View>
            ) : (
                <>
                    <ScrollView style={styles.scrollView}>
                        {isEditMode && lineItemId
                            ? orderReviews
                                .filter(review => review.lineItemId === lineItemId)
                                .map(renderReviewItem)
                            : orderReviews.map(renderReviewItem)
                        }
                        <View style={styles.bottomPadding} />
                    </ScrollView>

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            isSubmitting && styles.disabledSubmitButton
                        ]}
                        onPress={handleSubmitReview}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.submitButtonText}>
                                {isEditMode ? "Cập nhật" : "Gửi"}
                            </Text>
                        )}
                    </TouchableOpacity>
                </>
            )}

            <AlertDialog
                visible={alertVisible}
                message={alertMessage}
                onClose={() => {
                    setAlertVisible(false);
                    if (alertMessage.includes("thành công")) {
                        router.replace(`/account/list-review?orderId=${orderId}`);
                    }
                }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
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
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#555",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: "#555",
    },
    productCounter: {
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    counterText: {
        fontSize: 14,
        color: '#555',
    },
    highlightedText: {
        color: "#FF8C00",
        fontWeight: "bold",
    },
    productCard: {
        backgroundColor: "white",
        marginTop: 8,
        padding: 16,
        borderRadius: 4,
    },
    productInfo: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
        paddingBottom: 16,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 4,
        marginRight: 12,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333333",
        marginBottom: 4,
    },
    productVariant: {
        fontSize: 14,
        color: "#777777",
    },
    ratingSection: {
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333333",
        marginBottom: 12,
    },
    starsContainer: {
        flexDirection: "row",
    },
    star: {
        marginRight: 8,
    },
    reviewTextSection: {
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },
    reviewTextTitle: {
        fontSize: 14,
        color: "#333333",
        marginBottom: 12,
    },
    textInputContainer: {
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 4,
        padding: 12,
    },
    textInput: {
        minHeight: 80,
        fontSize: 14,
        color: "#333333",
        textAlignVertical: "top",
    },
    characterCount: {
        fontSize: 12,
        color: "#999999",
        textAlign: "right",
        marginTop: 8,
    },
    requiredText: {
        color: "red",
        fontSize: 12,
    },
    validationMessage: {
        color: "red",
        fontSize: 12,
        marginTop: 5,
        marginBottom: 5,
    },
    bottomPadding: {
        height: 20,
    },
    disabledSubmitButton: {
        backgroundColor: "#CCCCCC",
    },
    submitButton: {
        margin: 8,
        borderRadius: 8,
        backgroundColor: COLOR.PRIMARY,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    submitButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    // Preserving the styles from original file for commented sections
    uploadSection: {
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },
    uploadTitle: {
        fontSize: 14,
        color: "#333333",
        marginBottom: 12,
    },
    bonusText: {
        color: COLOR.PRIMARY,
        fontWeight: "bold",
    },
    uploadOptions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    uploadOption: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 4,
        borderStyle: "dashed",
        padding: 16,
        marginHorizontal: 4,
    },
    uploadIconContainer: {
        marginBottom: 8,
    },
    uploadOptionText: {
        fontSize: 14,
        color: "#555555",
    },
    textInputLabel: {
        fontSize: 14,
        color: "#333333",
        marginBottom: 8,
    },
    anonymousSection: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: "#CCCCCC",
        borderRadius: 4,
        marginRight: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    anonymousText: {
        fontSize: 14,
        color: "#333333",
    },
    sellerRatingsCard: {
        backgroundColor: "white",
        marginTop: 8,
        padding: 16,
        borderRadius: 4,
    },
    sellerRatingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    sellerRatingLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333333",
    },
    sellerStarsContainer: {
        flexDirection: "row",
    },
    courierInfo: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
        marginTop: 8,
    },
    courierLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: "#FF6347",
    },
    courierName: {
        fontSize: 14,
        color: "#555555",
    },
    mediaPreviewScroll: {
        paddingVertical: 8,
        marginBottom: 16,
    },
    mediaPreviewContainer: {
        marginRight: 8,
        position: 'relative',
    },
    mediaPreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    removeMediaButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
    },
    uploadOptionDisabled: {
        borderColor: '#eee',
        backgroundColor: '#f5f5f5',
    },
    uploadOptionTextDisabled: {
        color: '#ccc',
    },
})

