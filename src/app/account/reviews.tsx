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
} from "react-native"
import { Ionicons, FontAwesome, SimpleLineIcons } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"
import { FONT } from "@/src/constants/font"
import { COLOR } from "@/src/constants/color"
import * as ImagePicker from 'expo-image-picker'
import { Video, ResizeMode } from 'expo-av'

export default function ProductReviewScreen() {
    const router = useRouter()
    const params = useLocalSearchParams()
    const [rating, setRating] = useState(5)
    const [sellerRating, setSellerRating] = useState(5)
    const [deliveryRating, setDeliveryRating] = useState(5)
    const [shippingRating, setShippingRating] = useState(5)
    const [reviewText, setReviewText] = useState("")
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [mediaFiles, setMediaFiles] = useState<Array<{
        type: 'image' | 'video',
        uri: string
    }>>([])

    const getImagesCount = () => mediaFiles.filter(file => file.type === 'image').length
    const getVideoCount = () => mediaFiles.filter(file => file.type === 'video').length

    useEffect(() => {
        if (params.selectedMedia) {
            try {
                const selectedMediaFromCamera = JSON.parse(params.selectedMedia as string) as Array<{
                    type: 'image' | 'video',
                    uri: string
                }>;

                setMediaFiles(prev => {
                    const newMedia = selectedMediaFromCamera.filter(
                        (newItem: { uri: string }) => !prev.some(existingItem => existingItem.uri === newItem.uri)
                    )

                    const currentImages = prev.filter(item => item.type === 'image')
                    const currentVideos = prev.filter(item => item.type === 'video')

                    const newImages = newMedia.filter((item: { type: string }) => item.type === 'image')
                    const newVideos = newMedia.filter((item: { type: string }) => item.type === 'video')

                    const updatedImages = [...currentImages, ...newImages].slice(0, 5)
                    const updatedVideos = [...currentVideos, ...newVideos].slice(0, 1)

                    return [...updatedImages, ...updatedVideos]
                })
            } catch (error) {
                console.error('Failed to parse selected media', error)
            }
        }
    }, [params.selectedMedia])

    const pickImages = async () => {
        if (getImagesCount() >= 5) {
            Alert.alert("Thông báo", "Bạn chỉ có thể thêm tối đa 5 ảnh")
            return
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                allowsMultipleSelection: true,
                selectionLimit: 5 - getImagesCount(),
            })

            if (!result.canceled) {
                const newImages = result.assets.map(asset => ({
                    type: 'image' as const,
                    uri: asset.uri
                }))

                const totalImages = getImagesCount() + newImages.length
                if (totalImages > 5) {
                    Alert.alert("Thông báo", "Bạn chỉ có thể thêm tối đa 5 ảnh")
                    return
                }

                setMediaFiles(prev => [...prev, ...newImages])
            }
        } catch (error) {
            Alert.alert("Lỗi", "Không thể thêm ảnh. Vui lòng thử lại")
        }
    }

    const pickVideo = async () => {
        if (getVideoCount() >= 1) {
            Alert.alert("Thông báo", "Bạn chỉ có thể thêm 1 video")
            return
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 1,
                videoMaxDuration: 60,
            })

            if (!result.canceled) {
                setMediaFiles(prev => [...prev, { type: 'video', uri: result.assets[0].uri }])
            }
        } catch (error) {
            Alert.alert("Lỗi", "Không thể thêm video. Vui lòng thử lại")
        }
    }

    const removeMedia = (index: number) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index))
    }

    const renderStars = (count: number, activeCount: number, onPress: (rating: number) => void) => {
        return Array(count)
            .fill(0)
            .map((_, i) => (
                <TouchableOpacity key={i} onPress={() => onPress(i + 1)}>
                    <FontAwesome name="star" size={24} color={i < activeCount ? "#FFB800" : "#E0E0E0"} style={styles.star} />
                </TouchableOpacity>
            ))
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.headerTab}>
                <TouchableOpacity onPress={() => router.back()}>
                    <SimpleLineIcons name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đánh giá đơn hàng</Text>
                <View />
            </View>

            <ScrollView style={styles.scrollView}>

                <View style={styles.productCard}>
                    <View style={styles.productInfo}>
                        <Image source={{ uri: "https://v0.dev/placeholder.svg?height=80&width=80" }} style={styles.productImage} />
                        <View style={styles.productDetails}>
                            <Text style={styles.productName}>Cáp Sạc Nhanh Baseus Cổng USB C Sang 20W Ch...</Text>
                            <Text style={styles.productVariant}>1M Black</Text>
                        </View>
                    </View>

                    <View style={styles.ratingSection}>
                        <Text style={styles.sectionTitle}>Đánh giá sản phẩm</Text>
                        <View style={styles.starsContainer}>{renderStars(5, rating, setRating)}</View>
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
                        <Text style={styles.reviewTextTitle}>Viết đánh giá từ 50 ký tự</Text>
                        <View style={styles.textInputContainer}>
                            <TextInput
                                style={styles.textInput}
                                multiline
                                placeholder="Hãy chia sẻ nhận xét cho sản phẩm này bạn nhé!"
                                placeholderTextColor="#CCCCCC"
                                value={reviewText}
                                onChangeText={setReviewText}
                            />
                            <Text style={styles.characterCount}>0 ký tự</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Gửi</Text>
            </TouchableOpacity>
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
    textInputLabel: {
        fontSize: 14,
        color: "#333333",
        marginBottom: 8,
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

