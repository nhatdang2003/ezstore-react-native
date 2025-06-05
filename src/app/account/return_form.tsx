import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    TextInput,
    ActivityIndicator,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLOR } from "@/src/constants/color";
import * as Clipboard from 'expo-clipboard';
import { FONT } from "@/src/constants/font";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import { getOrderDetail } from "@/src/services/order.service";
import { createReturnRequest, uploadReturnRequestImage } from "@/src/services/return-request.service";
import { OrderDetailRes } from "@/src/types/order.type";
import { formatPrice } from "@/src/utils/product";
import AlertDialog from "@/src/components/AlertModal";

export default function ReturnFormScreen() {
    const { orderId } = useLocalSearchParams<{ orderId: string }>();
    const [bankName, setBankName] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [reason, setReason] = useState('');
    const [attachedImages, setAttachedImages] = useState<string[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderDetailRes | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    // Fetch order details when component mounts
    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                setLoading(false);
                return;
            }

            try {
                const response = await getOrderDetail(Number(orderId));
                setOrderDetails(response.data);
            } catch (error) {
                console.error("Error fetching order details:", error);
                showAlert('Lỗi', 'Không thể lấy thông tin đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    // Function to pick images from gallery
    const pickImages = async () => {
        // Ask for permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            showAlert('Thông báo', 'Cần cấp quyền truy cập thư viện ảnh');
            return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.8,
            allowsMultipleSelection: true,
            selectionLimit: 5,
        });

        if (!result.canceled) {
            // Check if adding new images exceeds the limit of 5
            const newImages = result.assets.map(asset => asset.uri);
            if (attachedImages.length + newImages.length > 5) {
                showAlert('Thông báo', 'Chỉ được chọn tối đa 5 hình ảnh');
                // Only add images up to the limit
                const remainingSlots = 5 - attachedImages.length;
                setAttachedImages([...attachedImages, ...newImages.slice(0, remainingSlots)]);
            } else {
                setAttachedImages([...attachedImages, ...newImages]);
            }
        }
    };

    // Function to remove an image
    const removeImage = (index: number) => {
        const updatedImages = [...attachedImages];
        updatedImages.splice(index, 1);
        setAttachedImages(updatedImages);
    };

    // Helper function to get filename from URI
    const getFilenameFromUri = (uri: string) => {
        // Extract the filename from the URI 
        const uriParts = uri.split('/');
        const filename = uriParts[uriParts.length - 1];

        // Make sure we have a valid extension or add one
        if (!filename.includes('.')) {
            return `${filename}.jpg`;
        }

        return filename;
    };

    // Function to upload a single image using signed URL
    const uploadImageToStorage = async (imageUri: string, signedUrl: string): Promise<boolean> => {
        try {
            // Get the image data
            const response = await fetch(imageUri);
            const blob = await response.blob();

            // Upload to Google Storage using the signed URL
            await fetch(signedUrl, {
                method: 'PUT',
                body: blob,
                headers: {
                    'Content-Type': 'image/jpeg',
                }
            });

            return true;
        } catch (error) {
            console.error('Error uploading image:', error);
            return false;
        }
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        if (!orderDetails) {
            showAlert('Lỗi', 'Không tìm thấy thông tin đơn hàng');
            return;
        }

        if (!bankName || !cardHolderName || !cardNumber || !reason) {
            showAlert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
            return;
        }

        setSubmitting(true);

        try {
            // Array to store the Google Storage URLs
            const imageUrls: string[] = [];

            // Process each image
            if (attachedImages.length > 0) {
                // Get signed URLs for each image and upload them
                await Promise.all(
                    attachedImages.map(async (imageUri) => {
                        try {
                            // Get filename from URI
                            const filename = getFilenameFromUri(imageUri);

                            // Get signed URL from API
                            const signedUrlResponse = await uploadReturnRequestImage({ fileName: filename });
                            const { signedUrl } = signedUrlResponse.data;

                            // Upload the image to Google Storage
                            const uploadSuccess = await uploadImageToStorage(imageUri, signedUrl);

                            if (uploadSuccess) {
                                // Extract the public URL from the signed URL (removing query parameters)
                                const publicUrl = signedUrl.split('?')[0];
                                imageUrls.push(publicUrl);
                            }
                        } catch (error) {
                            console.error('Error processing image:', error);
                        }
                    })
                );
            }

            // Create return request with uploaded image URLs
            const returnRequestData = {
                orderId: orderDetails.id,
                reason: reason,
                bankName: bankName,
                accountNumber: cardNumber,
                accountHolderName: cardHolderName,
                imageUrls: imageUrls,
            };

            const response = await createReturnRequest(returnRequestData);
            showAlert('Thành công', 'Đã gửi yêu cầu hoàn trả thành công');

            // Navigate to returned order screen with the new return request id
            router.replace({
                pathname: "/account/returned_order",
                params: {
                    orderId: orderDetails.id,
                    returnRequestId: response.data.id
                }
            });
        } catch (error) {
            console.error("Error creating return request:", error);
            showAlert('Lỗi', 'Lỗi khi gửi yêu cầu hoàn trả');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={COLOR.PRIMARY} />
                <Text style={styles.loadingText}>Đang tải thông tin đơn hàng...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <AlertDialog
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Yêu cầu hoàn trả</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Order ID Section */}
                <View style={styles.card}>
                    <View style={styles.orderIdRow}>
                        <Text style={styles.orderIdLabel}>Mã đơn hàng</Text>
                        <View style={styles.orderIdValue}>
                            <Text style={styles.orderId}>{orderDetails?.code || 'N/A'}</Text>
                            <TouchableOpacity
                                style={styles.copyButton}
                                onPress={async () => {
                                    if (!orderDetails?.code) return;

                                    await Clipboard.setStringAsync(orderDetails.code);
                                    showAlert('Thông báo', 'Đã sao chép mã đơn hàng');
                                }}
                            >
                                <Text style={styles.copyButtonText}>SAO CHÉP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Phương thức thanh toán</Text>
                        <View style={styles.paymentValue}>
                            <Text style={styles.paymentMethod}>
                                {orderDetails?.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'VNPAY'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Product Information */}
                <View style={styles.card}>
                    {orderDetails?.lineItems && orderDetails.lineItems.length > 0 && (
                        <>
                            <TouchableOpacity style={styles.storeRow}>
                                <View style={styles.storeInfo}>
                                    <Text style={styles.storeName}>EZ Store</Text>
                                </View>
                                <Feather name="chevron-right" size={20} color="#AAAAAA" />
                            </TouchableOpacity>

                            <View style={styles.divider} />

                            {/* Render the first product */}
                            <View style={styles.productRow}>
                                <Image
                                    source={{
                                        uri: orderDetails.lineItems[0].variantImage || "https://via.placeholder.com/80",
                                    }}
                                    style={styles.productImage}
                                />
                                <View style={styles.productDetails}>
                                    <Text style={styles.productName} numberOfLines={2}>
                                        {orderDetails.lineItems[0].productName}
                                    </Text>
                                    <Text style={styles.productVariant}>
                                        {orderDetails.lineItems[0].color} {orderDetails.lineItems[0].size}
                                    </Text>
                                    <View style={styles.quantityPriceRow}>
                                        <Text style={styles.quantity}>x{orderDetails.lineItems[0].quantity}</Text>
                                        <View style={styles.priceContainer}>
                                            {orderDetails.lineItems[0].discount > 0 && (
                                                <Text style={styles.originalPrice}>
                                                    {formatPrice(orderDetails.lineItems[0].unitPrice)}
                                                </Text>
                                            )}
                                            <Text style={styles.discountedPrice}>
                                                {formatPrice(orderDetails.lineItems[0].unitPrice - orderDetails.lineItems[0].discount)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Show more products indicator if there are more than one */}
                            {orderDetails.lineItems.length > 1 && (
                                <View style={styles.moreProductsIndicator}>
                                    <Text style={styles.moreProductsText}>
                                        Còn {orderDetails.lineItems.length - 1} sản phẩm khác
                                    </Text>
                                </View>
                            )}

                            <View style={styles.divider} />

                            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                                <Text>Tổng tiền:</Text>
                                <Text style={{ fontWeight: "500" }}>{formatPrice(orderDetails.finalTotal)}</Text>
                            </View>
                        </>
                    )}
                </View>

                <View style={{ ...styles.card, gap: 8 }}>
                    <View style={{ flex: 1 }}>
                        {/* Card Preview */}
                        <View style={{
                            borderRadius: 8,
                            padding: 20,
                            marginBottom: 8,
                            backgroundColor: '#000000',
                            // Using a simple background color as gradient requires additional libraries
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 8,
                            elevation: 5,
                        }}>
                            {/* Card Chip */}
                            <View style={{ marginBottom: 20 }}>
                                <MaterialCommunityIcons name="integrated-circuit-chip" size={40} color="#F3C623" />
                            </View>

                            {/* Bank Name */}
                            <View style={{
                                position: 'absolute',
                                top: 10,
                                right: 20,
                                flex: 1
                            }}>
                                <TextInput
                                    value={bankName}
                                    onChangeText={setBankName}
                                    placeholder="Nhập tên ngân hàng"
                                    placeholderTextColor={'#999'}
                                    style={{
                                        color: '#ffffff',
                                        fontSize: 18,
                                        marginBottom: 10
                                    }} />
                            </View>

                            {/* Card Number */}
                            <TextInput
                                value={cardNumber}
                                onChangeText={setCardNumber}
                                placeholder="Nhập số thẻ"
                                placeholderTextColor={'#999'}
                                keyboardType="numeric"
                                style={{
                                    fontSize: 18,
                                    color: '#fff',
                                }}
                            />

                            {/* Card Holder */}
                            <TextInput
                                value={cardHolderName}
                                onChangeText={setCardHolderName}
                                placeholder="Nhập tên chủ thẻ"
                                placeholderTextColor={'#999'}
                                style={{
                                    fontSize: 16,
                                    color: '#fff',
                                }}
                            />
                        </View>
                    </View>

                    <TextInput
                        value={reason}
                        onChangeText={setReason}
                        multiline
                        numberOfLines={5}
                        placeholder="Nhập lý do hoàn trả tại đây..."
                        style={{ height: 100, padding: 10, textAlignVertical: 'top', borderColor: 'black', borderWidth: 1, borderRadius: 8 }} />

                    <Text>Ảnh đính kèm</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {/* Image Previews */}
                        {attachedImages.map((image, index) => (
                            <View key={`${image}-${index}`} style={{
                                width: 100,
                                height: 100,
                                marginRight: 8,
                                borderRadius: 8,
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <Image source={{ uri: image }} style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 8
                                }} />
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        top: 4,
                                        right: 4,
                                        backgroundColor: 'rgba(255,255,255,0.8)',
                                        borderRadius: 12,
                                        padding: 0
                                    }}
                                    onPress={() => removeImage(index)}
                                >
                                    <Ionicons name="close-circle" size={24} color="rgba(0,0,0,0.6)" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity
                            style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center', borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginRight: 8 }}
                            onPress={pickImages}
                        >
                            <MaterialCommunityIcons name="plus-thick" size={24} color="#ccc" />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={styles.bottomButtons}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                    disabled={submitting}
                >
                    <Text style={styles.cancelButtonText} >
                        Hủy
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.submitButton, submitting && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Text style={styles.submitButtonText}>Gửi</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
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
        flex: 1,
        paddingTop: 8,
        marginBottom: 8,
    },
    statusContainer: {
        backgroundColor: COLOR.PRIMARY,
        padding: 16,
        marginTop: 8,
        marginHorizontal: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    statusText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
    card: {
        backgroundColor: "white",
        marginBottom: 8,
        padding: 16,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    moreProductsIndicator: {
        padding: 8,
        marginTop: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 4,
        alignItems: 'center',
    },
    moreProductsText: {
        fontSize: 12,
        color: '#666',
    },
    shippingInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    rowLeft: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 4,
    },
    shippingCarrier: {
        fontSize: 14,
        color: "#666666",
    },
    divider: {
        height: 1,
        backgroundColor: "#EEEEEE",
        marginVertical: 12,
    },
    deliveryStatusRow: {},
    deliveryStatus: {
        fontSize: 14,
        fontWeight: "500",
    },
    deliveryDate: {
        fontSize: 14,
        color: "#666666",
        marginTop: 2,
    },
    addressContainer: {
        flexDirection: "row",
        marginTop: 8,
    },
    addressDetails: {
        marginLeft: 12,
        flex: 1,
    },
    recipientName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333333",
    },
    phoneNumber: {
        fontWeight: "normal",
        color: "#666666",
    },
    addressRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    address: {
        fontSize: 14,
        color: "#666666",
        flex: 1,
    },
    viewMore: {
        fontSize: 14,
        color: "#AAAAAA",
        marginLeft: 4,
    },
    storeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    storeInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    storeIcon: {
        width: 20,
        height: 20,
        borderRadius: 4,
    },
    storeName: {
        fontSize: 14,
        fontWeight: "600",
    },
    productRow: {
        flexDirection: "row",
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 4,
        backgroundColor: "#F5F5F5",
    },
    productDetails: {
        flex: 1,
        marginLeft: 12,
    },
    productName: {
        fontSize: 14,
        color: "#333333",
    },
    productVariant: {
        fontSize: 14,
        color: "#999999",
        marginTop: 4,
    },
    quantityPriceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    quantity: {
        fontSize: 14,
        color: "#999999",
    },
    priceContainer: {
        alignItems: "flex-end",
    },
    originalPrice: {
        fontSize: 12,
        color: "#999999",
        textDecorationLine: "line-through",
    },
    discountedPrice: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333333",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    totalText: {
        fontSize: 14,
        color: "#333333",
    },
    totalPriceRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333333",
        marginRight: 4,
    },
    supportTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 12,
    },
    supportRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    supportOption: {
        flexDirection: "row",
        alignItems: "center",
    },
    supportText: {
        fontSize: 14,
        color: "#333333",
        marginLeft: 12,
    },
    orderIdRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    orderIdLabel: {
        fontSize: 14,
        color: "#333333",
    },
    orderIdValue: {
        flexDirection: "row",
        alignItems: "center",
    },
    orderId: {
        fontSize: 14,
        color: "#333333",
        marginRight: 8,
    },
    copyButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 4,
    },
    copyButtonText: {
        fontSize: 12,
        color: "#333333",
    },
    paymentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    paymentLabel: {
        fontSize: 14,
        color: "#333333",
    },
    paymentValue: {
        flexDirection: "row",
        alignItems: "center",
    },
    paymentMethod: {
        fontSize: 14,
        color: "#666666",
    },
    bottomButtons: {
        padding: 16,
        backgroundColor: "white",
        flexDirection: "row",
    },
    cancelButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLOR.PRIMARY,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        marginRight: 8,
        backgroundColor: "white",
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLOR.PRIMARY,
    },
    submitButton: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        marginLeft: 8,
        backgroundColor: COLOR.PRIMARY,
    },
    submitButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "white",
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
});