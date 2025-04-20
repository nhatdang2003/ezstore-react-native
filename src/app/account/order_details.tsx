import React, { useState, useEffect } from "react";
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
    ActivityIndicator,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLOR } from "@/src/constants/color";
import * as Clipboard from 'expo-clipboard';
import { FONT } from "@/src/constants/font";
import { useLocalSearchParams, router } from "expo-router";
import { getOrderDetail } from "@/src/services/order.service";
import { OrderDetailRes, OrderLineItem } from "@/src/types/order.type";
import { formatPrice } from "@/src/utils/product";

export default function OrderDetails() {
    const { orderId } = useLocalSearchParams();

    const [orderDetail, setOrderDetail] = useState<OrderDetailRes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            console.log(orderId)
            if (!orderId) {
                setError("Invalid order ID");
                setLoading(false);
                return;
            }

            try {
                const response = await getOrderDetail(Number(orderId));
                console.log(response.data)
                setOrderDetail(response.data);
            } catch (err) {
                console.error("Error fetching order details:", err);
                setError("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId]);

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            "PENDING": "Chờ xác nhận",
            "PROCESSING": "Đang xử lý",
            "SHIPPING": "Đang giao hàng",
            "DELIVERED": "Đã giao hàng",
            "CANCELLED": "Đã hủy",
            "RETURNED": "Đã trả hàng"
        };
        return statusMap[status] || status;
    };

    const getPaymentMethodText = (method: string) => {
        return method === "COD" ? "Thanh toán khi nhận hàng" : "VNPay";
    };

    const getDeliveryMethodText = (method: string) => {
        return method === "GHN" ? "GHN Express" : "Giao hàng hoả tốc";
    }

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={COLOR.PRIMARY} />
                <Text style={styles.loadingText}>Đang tải thông tin đơn hàng...</Text>
            </SafeAreaView>
        );
    }

    if (error || !orderDetail) {
        return (
            <SafeAreaView style={[styles.container, styles.errorContainer]}>
                <Text style={styles.errorText}>{error || "Không tìm thấy thông tin đơn hàng"}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Quay lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    // Computed name from firstName and lastName
    const recipientName = `${orderDetail.shippingProfile.firstName} ${orderDetail.shippingProfile.lastName}`;

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
                    <Text style={styles.statusText}>{getStatusText(orderDetail.status)}</Text>
                </View>
                <View style={styles.card}>
                    <TouchableOpacity style={styles.shippingInfoRow}>
                        <View style={styles.rowLeft}>
                            <Text style={styles.sectionTitle}>Thông tin vận chuyển</Text>
                            <Text style={styles.shippingCarrier}>{getDeliveryMethodText(orderDetail.deliveryMethod)}</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <View style={styles.deliveryStatusRow}>
                        <Text style={styles.deliveryStatus}>{getStatusText(orderDetail.status)}</Text>
                        {/* <Text style={styles.deliveryDate}>{new Date(orderDetail.orderDate).toLocaleString('vi-VN')}</Text> */}
                    </View>
                </View>

                {/* Delivery Address */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
                    <View style={styles.addressContainer}>
                        <Feather name="map-pin" size={20} color="#666666" />
                        <View style={styles.addressDetails}>
                            <Text style={styles.recipientName}>
                                {recipientName}{" "}
                                <Text style={styles.phoneNumber}>{orderDetail.shippingProfile.phoneNumber}</Text>
                            </Text>
                            <View style={styles.addressRow}>
                                <Text style={styles.address}>
                                    {orderDetail.shippingProfile.address}, {orderDetail.shippingProfile.ward}, {orderDetail.shippingProfile.district}, {orderDetail.shippingProfile.province}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Product Information */}
                <View style={styles.card}>
                    <TouchableOpacity style={styles.storeRow}>
                        <View style={styles.storeInfo}>
                            <Text style={styles.storeName}>Sản phẩm</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#AAAAAA" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    {orderDetail.lineItems.map((item, index) => (
                        <View key={index}>
                            <View style={styles.productRow}>
                                <Image
                                    source={{
                                        uri: item.variantImage || "https://placehold.co/100"
                                    }}
                                    style={styles.productImage}
                                />
                                <View style={styles.productDetails}>
                                    <Text style={styles.productName} numberOfLines={2}>
                                        {item.productName}
                                    </Text>
                                    <Text style={styles.productVariant}>
                                        {item.color} {item.size}
                                    </Text>
                                    <View style={styles.quantityPriceRow}>
                                        <Text style={styles.quantity}>x{item.quantity}</Text>
                                        <View style={styles.priceContainer}>
                                            {/* Add a conditional check for originalPrice if it doesn't exist on OrderLineItem */}
                                            {item.discount > 0 && (
                                                <Text style={styles.originalPrice}>
                                                    {formatPrice(item.unitPrice + item.discount)}
                                                </Text>
                                            )}
                                            <Text style={styles.discountedPrice}>{formatPrice(item.unitPrice)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {index < orderDetail.lineItems.length - 1 && <View style={styles.divider} />}
                        </View>
                    ))}

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.totalRow}>
                        <Text style={styles.totalText}>Thành tiền:</Text>
                        <Text style={styles.totalPrice}>{formatPrice(orderDetail.finalTotal)}</Text>
                    </TouchableOpacity>
                </View>

                {/* Support Section */}
                <View style={styles.card}>
                    <Text style={styles.supportTitle}>Bạn cần hỗ trợ?</Text>

                    {orderDetail.status === "DELIVERED" && (
                        <>
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
                        </>
                    )}

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
                            <Text style={styles.orderId}>{orderDetail.code}</Text>
                            <TouchableOpacity
                                style={styles.copyButton}
                                onPress={async () => {
                                    await Clipboard.setStringAsync(orderDetail.code);
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
                                {getPaymentMethodText(orderDetail.paymentMethod)}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            {(orderDetail.status === "DELIVERED" || orderDetail.status === "CANCELLED") && (
                <View style={styles.bottomButtons}>
                    {orderDetail.status === "DELIVERED" && (
                        <>
                            {orderDetail.canReview && !orderDetail.isReviewed ? (
                                <TouchableOpacity
                                    style={styles.reviewButton}
                                    onPress={() => router.push(`/account/reviews?orderId=${orderDetail.id}`)}
                                >
                                    <Text style={styles.reviewButtonText}>Đánh giá</Text>
                                </TouchableOpacity>
                            ) : orderDetail.isReviewed && (
                                <TouchableOpacity
                                    style={styles.reviewButton}
                                    onPress={() => router.push(`/account/list-review?orderId=${orderDetail.id}`)}
                                >
                                    <Text style={styles.reviewButtonText}>Xem đánh giá</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}

                    <TouchableOpacity style={[
                        styles.buyAgainButton,
                        orderDetail.status === "DELIVERED" && (orderDetail.canReview || orderDetail.isReviewed) && styles.buyAgainButtonWithReview
                    ]}>
                        <Text style={styles.buyAgainButtonText}>Mua lại</Text>
                    </TouchableOpacity>
                </View>
            )}
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
        color: '#666',
        fontSize: 16,
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    backButtonText: {
        color: COLOR.PRIMARY,
        fontSize: 16,
        fontWeight: '600',
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
        backgroundColor: COLOR.PRIMARY,
    },
    buyAgainButtonWithReview: {
        marginLeft: 8,
    },
    buyAgainButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "white",
    },
});
