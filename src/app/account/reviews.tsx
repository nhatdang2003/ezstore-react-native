import React from 'react';
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
import { Video, ResizeMode } from 'expo-av';
import { Ionicons, FontAwesome, SimpleLineIcons } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"
import { FONT } from "@/src/constants/font"
import { COLOR } from "@/src/constants/color"
import { getOrderReviews, createOrderReview, updateOrderReview, getReviewUploadSignUrl } from "@/src/services/order.service"
import { OrderReviewRequest, OrderReviewResponse, ReviewUploadSignUrlReq } from "@/src/types/review.type"
import AlertDialog from "@/src/components/AlertModal"
import * as ImagePicker from 'expo-image-picker';
import MediaViewer, { MediaItem } from '@/src/components/MediaViewer'

export default function ProductReviewScreen() {
    const router = useRouter()
    const params = useLocalSearchParams()
    const [mediaFiles, setMediaFiles] = useState<Array<{
        type: 'image' | 'video',
        uri: string,
        fileName: string,
        isExisting?: boolean
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

    useEffect(() => {
        // Load existing media files in edit mode
        if (isEditMode && lineItemId && orderReviews.length > 0) {
            const review = orderReviews.find(r => r.lineItemId === lineItemId);
            if (review) {
                const existingMedia = [
                    ...(review.imageUrls?.map((url, index) => ({
                        type: 'image' as const,
                        uri: url,
                        fileName: `existing_image_${index}.jpg`,
                        isExisting: true
                    })) || []),
                    ...(review.videoUrl ? [{
                        type: 'video' as const,
                        uri: review.videoUrl,
                        fileName: 'existing_video.mp4',
                        isExisting: true
                    }] : [])
                ];
                setMediaFiles(existingMedia);
            }
        }
    }, [isEditMode, lineItemId, orderReviews]);

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

    // Function to pick images from library
    const pickImages = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Quyền truy cập', 'Cần quyền truy cập thư viện ảnh để chọn hình ảnh');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                selectionLimit: 5 - getImagesCount(),
                quality: 0.8,
            });

            if (!result.canceled && result.assets) {
                const newImages = result.assets.map(asset => ({
                    type: 'image' as const,
                    uri: asset.uri,
                    fileName: asset.fileName || `image_${Date.now()}.jpg`
                }));
                
                setMediaFiles(prev => [...prev, ...newImages]);
            }
        } catch (error) {
            console.error('Error picking images:', error);
            Alert.alert('Lỗi', 'Không thể chọn hình ảnh');
        }
    };

    // Function to pick video from library
    const pickVideo = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Quyền truy cập', 'Cần quyền truy cập thư viện ảnh để chọn video');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                const asset = result.assets[0];
                const newVideo = {
                    type: 'video' as const,
                    uri: asset.uri,
                    fileName: asset.fileName || `video_${Date.now()}.mp4`
                };
                
                setMediaFiles(prev => [...prev, newVideo]);
            }
        } catch (error) {
            console.error('Error picking video:', error);
            Alert.alert('Lỗi', 'Không thể chọn video');
        }
    };

    // Function to remove media file
    const removeMedia = (index: number) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Function to upload files to cloud storage
    const uploadFiles = async () => {
        if (mediaFiles.length === 0) {
            return { imageUrls: [], videoUrl: '' };
        }

        try {
            // Separate new and existing files
            const newFiles = mediaFiles.filter(file => !file.isExisting);
            const existingFiles = mediaFiles.filter(file => file.isExisting);

            let uploadedUrls: { type: 'image' | 'video', url: string }[] = [];

            // Add existing files to uploadedUrls
            uploadedUrls = [
                ...existingFiles.map(file => ({
                    type: file.type,
                    url: file.uri // For existing files, uri is the actual URL
                }))
            ];

            // Upload new files if any
            if (newFiles.length > 0) {
                // Get signed URLs for all new files
                const fileNames = newFiles.map(file => file.fileName);
                const signUrlRequest: ReviewUploadSignUrlReq = {
                    fileNames: fileNames
                };

                const signUrlResponse = await getReviewUploadSignUrl(signUrlRequest);
                const signedUrls = signUrlResponse.data.signedUrls;

                // Upload new files
                const newUploadPromises = newFiles.map(async (file) => {
                    const signedUrlData = signedUrls.find(url => url.fileName === file.fileName);
                    if (!signedUrlData) {
                        throw new Error(`No signed URL found for ${file.fileName}`);
                    }

                    const response = await fetch(file.uri);
                    const blob = await response.blob();

                    const uploadResponse = await fetch(signedUrlData.signedUrl, {
                        method: 'PUT',
                        body: blob,
                        headers: {
                            'Content-Type': file.type === 'image' ? 'image/jpeg' : 'video/mp4',
                        },
                    });

                    if (!uploadResponse.ok) {
                        throw new Error(`Upload failed for ${file.fileName}`);
                    }

                    const publicUrl = signedUrlData.signedUrl.split('?')[0];
                    return {
                        type: file.type,
                        url: publicUrl
                    };
                });

                const newUploadResults = await Promise.all(newUploadPromises);
                uploadedUrls = [...uploadedUrls, ...newUploadResults];
            }

            const imageUrls = uploadedUrls
                .filter(result => result.type === 'image')
                .map(result => result.url);
            
            const videoUrl = uploadedUrls
                .find(result => result.type === 'video')?.url || '';

            return { imageUrls, videoUrl };
        } catch (error) {
            console.error('Upload failed:', error);
            throw new Error('Không thể tải lên file. Vui lòng thử lại.');
        }
    };

    const handleSubmitReview = async () => {
        setShowValidation(true);

        if (!areAllReviewsValid()) {
            setAlertMessage("Vui lòng điền đầy đủ thông tin đánh giá cho tất cả sản phẩm")
            setAlertVisible(true)
            return;
        }

        try {
            setIsSubmitting(true);

            // Upload files first
            const { imageUrls, videoUrl } = await uploadFiles();

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
                        description: reviewData.description,
                        imageUrls,
                        videoUrl: videoUrl || ""
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
                            description: reviewData.description,
                            imageUrls,
                            videoUrl: videoUrl || ""
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
                <View style={styles.uploadSection}>
                    {mediaFiles.length > 0 && (
                        <MediaViewer 
                            mediaItems={mediaFiles.map(file => ({
                                type: file.type,
                                url: file.uri
                            }))}
                            onRemove={removeMedia}
                            editable={true}
                        />
                    )}

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
                </View>

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

            {!isEditMode && (
                <View style={styles.rewardNotice}>
                    <FontAwesome name="star" size={16} color="#FFB800" style={{ marginRight: 5 }} />
                    <Text style={styles.rewardText}>Đánh giá để nhận <Text style={{ fontWeight: 'bold', color: '#FFB800' }}>200 điểm</Text> !</Text>
                </View>
            )}

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
    uploadSection: {
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
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
    uploadOptionDisabled: {
        borderColor: '#eee',
        backgroundColor: '#f5f5f5',
    },
    uploadOptionTextDisabled: {
        color: '#ccc',
    },
    rewardNotice: {
        padding: 12,
        backgroundColor: '#FFF9E5',
        borderBottomColor: '#FFE49D',
        flexDirection: 'row',
        alignItems: 'center',
    },
    rewardText: {
        fontSize: 14,
    },
})

