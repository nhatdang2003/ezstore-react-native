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
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLOR } from "@/src/constants/color";
import * as Clipboard from 'expo-clipboard';
import { FONT } from "@/src/constants/font";
import { router } from "expo-router";

export default function OrderDetails() {
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
                <Text style={styles.headerTitle}>Thông tin đơn hàng</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Shipping Information */}
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>Đơn hàng đã hoàn thành</Text>
                </View>
                <View style={styles.card}>
                    <TouchableOpacity style={styles.shippingInfoRow}>
                        <View style={styles.rowLeft}>
                            <Text style={styles.sectionTitle}>Thông tin vận chuyển</Text>
                            <Text style={styles.shippingCarrier}>Mã giao hàng nhanh: </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <View style={styles.deliveryStatusRow}>
                        <Text style={styles.deliveryStatus}>Giao hàng thành công</Text>
                        <Text style={styles.deliveryDate}>16-03-2025 13:08</Text>
                    </View>
                </View>

                {/* Delivery Address */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
                    <View style={styles.addressContainer}>
                        <Feather name="map-pin" size={20} color="#666666" />
                        <View style={styles.addressDetails}>
                            <Text style={styles.recipientName}>
                                Phú Quý{" "}
                                <Text style={styles.phoneNumber}>(+84) 342 609 928</Text>
                            </Text>
                            <View style={styles.addressRow}>
                                <Text style={styles.address}>
                                    Phòng DK02, Toà Nhà Bekind, 76/3, Đường Số 7, Phường 4, Quận
                                    4, Thành phố Hồ Chí Minh, Việt Nam
                                </Text>
                            </View>
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
                            <Text style={styles.productVariant}>1M Black</Text>
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

                    <TouchableOpacity style={styles.totalRow}>
                        <Text style={styles.totalText}>Thành tiền:</Text>
                        <Text style={styles.totalPrice}>₫109.000</Text>
                    </TouchableOpacity>
                </View>

                {/* Support Section */}
                <View style={styles.card}>
                    <Text style={styles.supportTitle}>Bạn cần hỗ trợ?</Text>

                    <TouchableOpacity style={styles.supportRow}>
                        <View style={styles.supportOption}>
                            <Feather name="rotate-ccw" size={20} color="#666666" />
                            <Text style={styles.supportText}>
                                Gửi yêu cầu Trả hàng/Hoàn tiền
                            </Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#AAAAAA" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.supportRow}>
                        <View style={styles.supportOption}>
                            <Feather name="message-circle" size={20} color="#666666" />
                            <Text style={styles.supportText}>Liên hệ Shop</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#AAAAAA" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.supportRow}>
                        <View style={styles.supportOption}>
                            <Feather name="help-circle" size={20} color="#666666" />
                            <Text style={styles.supportText}>Trung tâm Hỗ trợ</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#AAAAAA" />
                    </TouchableOpacity>
                </View>

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
                                Tài khoản ngân hàng đã liên k...
                            </Text>
                            <TouchableOpacity>
                                <Text style={styles.viewMore}>Xem thêm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={styles.bottomButtons}>
                <TouchableOpacity style={styles.reviewButton}>
                    <Text style={styles.reviewButtonText}>Xem đánh giá</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buyAgainButton}>
                    <Text style={styles.buyAgainButtonText}>Mua lại</Text>
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
        marginLeft: 8,
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
    reviewButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLOR.PRIMARY,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        marginRight: 8,
        backgroundColor: "white",
    },
    reviewButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLOR.PRIMARY,
    },
    buyAgainButton: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        marginLeft: 8,
        backgroundColor: COLOR.PRIMARY,
    },
    buyAgainButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "white",
    },
});
