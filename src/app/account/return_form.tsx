import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    ToastAndroid,
    Platform,
    Alert,
    TextInput,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLOR } from "@/src/constants/color";
import * as Clipboard from 'expo-clipboard';
import { FONT } from "@/src/constants/font";
import { router } from "expo-router";
import React, { useState } from "react";
import * as ImagePicker from 'expo-image-picker';

export default function ReturnFormScreen() {
    const [bankName, setBankName] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [reason, setReason] = useState('');
    const [attachedImages, setAttachedImages] = useState<string[]>([]);

    // Function to pick images from gallery
    const pickImages = async () => {
        // Ask for permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            if (Platform.OS === "android") {
                ToastAndroid.show(
                    "Cần cấp quyền truy cập thư viện ảnh",
                    ToastAndroid.SHORT
                );
            } else {
                Alert.alert("Thông báo", "Cần cấp quyền truy cập thư viện ảnh");
            }
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
                if (Platform.OS === "android") {
                    ToastAndroid.show(
                        "Chỉ được chọn tối đa 5 hình ảnh",
                        ToastAndroid.SHORT
                    );
                } else {
                    Alert.alert("Thông báo", "Chỉ được chọn tối đa 5 hình ảnh");
                }
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
                <Text style={styles.headerTitle}>Yêu cầu hoàn trả</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Order ID Section */}
                <View style={styles.card}>
                    <View style={styles.orderIdRow}>
                        <Text style={styles.orderIdLabel}>Mã đơn hàng</Text>
                        <View style={styles.orderIdValue}>
                            <Text style={styles.orderId}>250314K01X5SU7</Text>
                            <TouchableOpacity
                                style={styles.copyButton}
                                onPress={async () => {
                                    const orderId = "250314K01X5SU7";

                                    await Clipboard.setStringAsync(orderId);
                                    // Show feedback based on platform
                                    if (Platform.OS === "android") {
                                        ToastAndroid.show(
                                            "Đã sao chép mã đơn hàng",
                                            ToastAndroid.SHORT
                                        );
                                    } else {
                                        Alert.alert("Thông báo", "Đã sao chép mã đơn hàng");
                                    }
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
                                Thanh toán khi nhận hàng
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Product Information */}
                <View style={styles.card}>
                    <TouchableOpacity style={styles.storeRow}>
                        <View style={styles.storeInfo}>
                            <Text style={styles.storeName}>Baseus Official Mall</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#AAAAAA" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <View style={styles.productRow}>
                        <Image
                            source={{
                                uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2366451c-9ea3-4dd0-b454-ab0c6454f354.jpg-CPLbbbMNG52r3dHe5kdLJ1PniWunyh.jpeg",
                            }}
                            style={styles.productImage}
                        />
                        <View style={styles.productDetails}>
                            <Text style={styles.productName} numberOfLines={2}>
                                Cáp Sạc Nhanh Baseus Cổng USB C Sang 2...
                            </Text>
                            <Text style={styles.productVariant}>M Black</Text>
                            <View style={styles.quantityPriceRow}>
                                <Text style={styles.quantity}>x1</Text>
                                <View style={styles.priceContainer}>
                                    <Text style={styles.originalPrice}>₫218.000</Text>
                                    <Text style={styles.discountedPrice}>₫109.000</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                        <Text>Tổng tiền:</Text>
                        <Text style={{ fontWeight: 500 }}>109.000đ</Text>
                    </View>
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
                >
                    <Text style={styles.cancelButtonText} >
                        Hủy
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => {
                        router.push("/account/returned_order");
                    }}
                >
                    <Text style={styles.submitButtonText}>Gửi</Text>
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
});