import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { COLOR } from "@/src/constants/color";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { router } from "expo-router";
import { FONT } from "@/src/constants/font";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { STATUS_ORDER } from "@/src/constants/order";
import { formatPrice } from "@/src/utils/product";
import CustomButton from "@/src/components/CustomButton";

const OrderHistoryScreen = () => {
    const [activeTab, setActiveTab] = useState<string>(STATUS_ORDER[0].value);
    // const [orders, setOrders] = useState([])
    const [pendingOrders, setPendingOrders] = useState([])
    const [processingOrders, setProcessingOrders] = useState([])
    const [shippingOrders, setShippingOrders] = useState([])
    const [deliveredOrders, setDeliveredOrders] = useState([])
    const [cancelledOrders, setCancelledOrders] = useState([])
    const [returnedOrders, setReturnedOrders] = useState([])

    const dataOrders = {
        PENDING: pendingOrders,
        PROCESSING: processingOrders,
        SHIPPING: shippingOrders,
        DELIVERED: deliveredOrders,
        CANCELLED: cancelledOrders,
        RETURNED: returnedOrders
    }

    const getOrders = async (status: string) => { }

    useEffect(() => {
        if (activeTab === 'PENDING' && pendingOrders.length === 0) {
            const res = getOrders(activeTab)
            setPendingOrders(res)
        } else if (activeTab === 'PROCESSING' && processingOrders.length === 0) {
            const res = getOrders(activeTab)
            setProcessingOrders(res)
        } else if (activeTab === 'SHIPPING' && shippingOrders.length === 0) {
            const res = getOrders(activeTab)
            setShippingOrders(res)
        } else if (activeTab === 'DELIVERED' && deliveredOrders.length === 0) {
            const res = getOrders(activeTab)
            setDeliveredOrders(res)
        } else if (activeTab === 'CANCELLED' && cancelledOrders.length === 0) {
            const res = getOrders(activeTab)
            setCancelledOrders(res)
        } else if (activeTab === 'RETURNED' && returnedOrders.length === 0) {
            const res = getOrders(activeTab)
            setReturnedOrders(res)
        }
    }, [activeTab])

    const orders = [
        {
            id: 1,
            tag: "Yêu thích",
            seller: "Thang Nhôm Rút Nhật Bản 107",
            status: "Hoàn thành",
            name: "Bánh xe ghế văn phòng cao cấp, bánh xe JU...",
            details: "Tỷ Đẩy - Bánh Trắng",
            quantity: 1,
            price: 13500,
            totalPrice: 16500,
            image: require("./../../assets/images/facebook-logo.png"),
            canReview: true,
            canBuyAgain: true,
        },
        {
            id: 2,
            seller: "Gia Dụng Jumi",
            status: "Hoàn thành",
            name: "Bộ Ga Giường Trần Bông Phi Lụa Mềm Mịn...",
            details: "Màu Đỏ, 1m2x1m9 (+2 vỏ gối)",
            quantity: 1,
            originalPrice: 260000,
            price: 155000,
            totalPrice: 166000,
            image: require("./../../assets/images/facebook-logo.png"),
            canReview: false,
            canBuyAgain: true,
        },
        {
            id: 3,
            seller: "ZF.CLUB",
            status: "Hoàn thành",
            name: "Quần Short ZONEF CLUB Kaki Nam Nữ, Quần...",
            details: "Kem L (63-80kg)",
            quantity: 2,
            originalPrice: 99000,
            price: 68000,
            totalPrice: 189020,
            image: require("./../../assets/images/facebook-logo.png"),
            canReview: false,
            canBuyAgain: true,
            hasMore: true,
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <SimpleLineIcons name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đơn đã mua</Text>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="magnify" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabsScrollContent}
                >
                    {STATUS_ORDER.map((tab) => (
                        <TouchableOpacity
                            key={tab.value}
                            style={[styles.tab, activeTab === tab.value && styles.activeTab]}
                            onPress={() => setActiveTab(tab.value)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab.value && styles.activeTabText,
                                ]}
                            >
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Orders */}
            <ScrollView style={styles.ordersContainer}>
                {dataOrders[activeTab].map((order) => (
                    <View key={order.id} style={styles.orderCard}>
                        {/* Product info */}
                        <View style={styles.productRow}>
                            <Image source={order.image} style={styles.productImage} />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName} numberOfLines={1}>
                                    {order.name}
                                </Text>
                                <View style={styles.containerDetail}>
                                    <Text style={styles.productDetails}>{order.details}</Text>
                                    <Text style={styles.quantityText}>x{order.quantity}</Text>
                                </View>
                                <View style={styles.priceRow}>
                                    {order.originalPrice && (
                                        <Text style={styles.originalPrice}>
                                            {formatPrice(order.originalPrice)}
                                        </Text>
                                    )}
                                    <Text style={styles.price}>{formatPrice(order.price)}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>
                                Tổng số tiền ({order.quantity} sản phẩm):
                            </Text>
                            <Text style={styles.totalPrice}>
                                {formatPrice(order.totalPrice)}
                            </Text>
                        </View>

                        {/* Action buttons */}
                        <View style={styles.actionRow}>
                            {order.canReview && (
                                <CustomButton
                                    variant="outlined"
                                    title="Đánh giá"
                                    onPress={() => { }}
                                    style={styles.reviewButton}
                                    textStyle={styles.reviewButtonText}
                                />
                            )}
                        </View>

                        {/* Show more button */}
                        {order.hasMore && (
                            <TouchableOpacity style={styles.showMoreButton}>
                                <Text style={styles.showMoreText}>Xem thêm</Text>
                                <MaterialCommunityIcons
                                    name="chevron-down"
                                    size={16}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "#FFF",
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: FONT.LORA_MEDIUM,
    },
    tabsContainer: {
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    tabsScrollContent: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        gap: 24,
    },
    tab: {
        paddingVertical: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: COLOR.PRIMARY,
    },
    tabText: {
        fontSize: 14,
        color: "#666",
        fontFamily: FONT.LORA,
    },
    activeTabText: {
        color: COLOR.PRIMARY,
        fontFamily: FONT.LORA_MEDIUM,
    },
    ordersContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    orderCard: {
        backgroundColor: "#FFF",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    sellerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    tagContainer: {
        backgroundColor: "#FF4D4F",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
        marginRight: 8,
    },
    tagText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "500",
    },
    sellerName: {
        flex: 1,
        fontSize: 14,
        fontWeight: "500",
    },
    orderStatus: {
        fontSize: 13,
        color: "#FF4D4F",
    },
    productRow: {
        flexDirection: "row",
        marginBottom: 10,
    },
    productImage: {
        width: 60,
        height: 80,
        borderRadius: 4,
        marginRight: 10,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontFamily: FONT.LORA_MEDIUM,
        fontSize: 16,
        marginBottom: 4,
    },
    containerDetail: {
        justifyContent: "space-between",
        flex: 1,
        flexDirection: "row",
    },
    productDetails: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    quantityRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    quantityText: {
        fontSize: 13,
        color: "#666",
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 5,
    },
    originalPrice: {
        fontSize: 13,
        color: "#999",
        textDecorationLine: "line-through",
        marginRight: 5,
    },
    price: {
        fontSize: 15,
        fontWeight: "500",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingTop: 8,
        gap: 4,
    },
    totalText: {
        fontSize: 13,
    },
    totalPrice: {
        fontSize: 15,
        fontWeight: "bold",
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
        gap: 5,
    },
    reviewButton: {
        paddingVertical: 10,
        borderColor: COLOR.PRIMARY,
        borderWidth: 1
    },
    reviewButtonText: {
        color: '#000',
        fontSize: 14,
    },
    showMoreButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    showMoreText: {
        fontSize: 13,
        color: "#666",
        marginRight: 5,
    },
    bottomBanner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#000",
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    liveTag: {
        backgroundColor: "#FF4D4F",
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 3,
        marginRight: 8,
    },
    liveTagText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "bold",
    },
    bannerText: {
        flex: 1,
        color: "#FFF",
        fontSize: 14,
    },
    bannerStatus: {
        color: "#FF4D4F",
        fontSize: 13,
    },
});

export default OrderHistoryScreen;
