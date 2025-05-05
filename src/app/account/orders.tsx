import React, { useState, memo, useCallback, useRef } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { COLOR } from "@/src/constants/color";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { router } from "expo-router";
import { FONT } from "@/src/constants/font";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { STATUS_ORDER } from "@/src/constants/order";
import { formatPrice } from "@/src/utils/product";
import CustomButton from "@/src/components/CustomButton";
import { OrderHistory } from "@/src/types/order.type";
import { getOrderHistoryUser, cancelOrder } from "@/src/services/order.service";
import { useFocusEffect } from "expo-router";
import CancelOrderModal from "@/src/components/CancelOrderModal";
import AlertDialog from "@/src/components/AlertModal";
import ConfirmDialog from "@/src/components/ConfirmModal";

const OrderHistoryScreen = () => {
    const [activeTab, setActiveTab] = useState<string>(STATUS_ORDER[0].value);

    const [orders, setOrders] = useState<Record<string, OrderHistory[]>>({
        PENDING: [],
        PROCESSING: [],
        SHIPPING: [],
        DELIVERED: [],
        CANCELLED: [],
        RETURNED: [],
    });

    const [page, setPage] = useState<Record<string, number>>({
        PENDING: 0,
        PROCESSING: 0,
        SHIPPING: 0,
        DELIVERED: 0,
        CANCELLED: 0,
        RETURNED: 0,
    });

    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState<Record<string, boolean>>({
        PENDING: true,
        PROCESSING: true,
        SHIPPING: true,
        DELIVERED: true,
        CANCELLED: true,
        RETURNED: true,
    });

    // Thêm một Ref để theo dõi requests đang xử lý, thay vì dùng state
    const pendingRequests = useRef<Record<string, boolean>>({
        PENDING: false,
        PROCESSING: false,
        SHIPPING: false,
        DELIVERED: false,
        CANCELLED: false,
        RETURNED: false,
    });

    // Thêm state để lưu trữ trạng thái expanded cho từng đơn hàng
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
        {}
    );

    // States for modals
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [selectedOrderForCancel, setSelectedOrderForCancel] = useState<OrderHistory | null>(null);
    const [cancellingOrder, setCancellingOrder] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string>('');

    // Add states for alert messages
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    // Cải thiện hàm fetchData để xử lý trùng lặp
    const fetchData = useCallback(async (isRefreshing = false) => {
        const status = activeTab;
        const currentPage = isRefreshing ? 0 : page[status];

        // Skip if we're fetching more items but there are no more
        if (!isRefreshing && !hasMore[status]) {
            return;
        }

        // If already processing a request for this tab, skip
        if (pendingRequests.current[status]) {
            return;
        }

        // If loading or loadingMore and not refreshing, skip
        if ((loading || loadingMore) && !isRefreshing) {
            return;
        }

        // Mark as pending
        pendingRequests.current[status] = true;
        isRefreshing ? setLoading(true) : setLoadingMore(true);

        try {
            const response = await getOrderHistoryUser({
                page: currentPage,
                size: 10,
                status,
            });

            const newOrders = response.data.data;
            const { page: responsePage, pages: totalPages } = response.data.meta;
            const moreDataAvailable = responsePage < totalPages - 1;

            setPage((prev) => ({ ...prev, [status]: responsePage + 1 }));
            setHasMore((prev) => ({ ...prev, [status]: moreDataAvailable }));

            // If refreshing, replace the entire list
            if (isRefreshing) {
                setOrders(prev => ({ ...prev, [status]: newOrders }));
            } else {
                // Otherwise merge with existing list
                setOrders(prev => {
                    const existingOrders = prev[status];
                    const allOrdersMap = new Map<number, OrderHistory>();

                    existingOrders.forEach(order => {
                        allOrdersMap.set(order.id, order);
                    });

                    newOrders.forEach(order => {
                        allOrdersMap.set(order.id, order);
                    });

                    return {
                        ...prev,
                        [status]: Array.from(allOrdersMap.values())
                    };
                });
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setHasMore(prev => ({ ...prev, [status]: false }));
        } finally {
            setLoading(false);
            setLoadingMore(false);
            pendingRequests.current[status] = false;
        }
    }, [activeTab, page, hasMore]);

    const keyExtractor = useCallback(
        (item: OrderHistory) => `order-${item.id}`,
        []
    );

    // Hàm để toggle trạng thái expanded cho một đơn hàng
    const toggleExpand = useCallback((orderId: number) => {
        setExpandedItems((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    }, []);

    // Add a function to check if an order is eligible for return (within 30 days)
    const isEligibleForReturn = useCallback((order: OrderHistory) => {
        // If the order isn't DELIVERED, return false
        if (order.status !== "DELIVERED") {
            return false;
        }

        // Check if statusUpdateTimestamp is available
        if (!order.statusUpdateTimestamp) {
            return false;
        }

        // Get the timestamp of the status update
        const statusUpdateDate = new Date(order.statusUpdateTimestamp);
        const currentDate = new Date();

        // Calculate the difference in milliseconds
        const diffTime = currentDate.getTime() - statusUpdateDate.getTime();

        // Convert to days
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        // Check if it's within 30 days
        return diffDays <= 30;
    }, []);

    // Show alert function
    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    // Function to handle the selection of a reason and showing confirmation
    const handleReasonSelected = useCallback((reason: string) => {
        setSelectedReason(reason);
        setCancelModalVisible(false);
        setConfirmModalVisible(true);
    }, []);

    // Add this function to handle order cancellation (final step after confirmation)
    const handleCancelOrder = useCallback(async () => {
        if (!selectedOrderForCancel || !selectedReason) return;

        setCancellingOrder(true);
        try {
            await cancelOrder({
                orderId: selectedOrderForCancel.id,
                reason: selectedReason
            });

            // Update UI with properly typed status
            setOrders(prev => {
                const status = activeTab;
                const updatedOrders = prev[status].map(order => {
                    if (order.id === selectedOrderForCancel.id) {
                        // Explicitly cast the new status as the correct type
                        return {
                            ...order,
                            status: "CANCELLED" as "PENDING" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELLED" | "RETURNED",
                            cancelReason: selectedReason
                        };
                    }
                    return order;
                });
                return { ...prev, [status]: updatedOrders };
            });

            // Show success message using AlertDialog
            showAlert("Thành công", "Đã hủy đơn hàng thành công");

            // Reset state after successful cancellation
            setConfirmModalVisible(false);
            setSelectedOrderForCancel(null);
            setSelectedReason('');

            // Refresh the orders list
            setPage(prev => ({ ...prev, [activeTab]: 0 }));
            setOrders(prev => ({ ...prev, [activeTab]: [] }));
            setHasMore(prev => ({ ...prev, [activeTab]: true }));
            setTimeout(() => {
                fetchData(true);
            }, 500);

        } catch (error) {
            console.error("Error cancelling order:", error);

            // Show error message using AlertDialog
            showAlert("Lỗi", "Không thể hủy đơn hàng");
        } finally {
            setCancellingOrder(false);
            setConfirmModalVisible(false);
        }
    }, [selectedOrderForCancel, selectedReason, activeTab, fetchData]);

    // Open the cancel modal (first step)
    const openCancelModal = useCallback((order: OrderHistory) => {
        setSelectedOrderForCancel(order);
        setCancelModalVisible(true);
    }, []);

    // Reset all modal states
    const resetModalStates = useCallback(() => {
        setCancelModalVisible(false);
        setConfirmModalVisible(false);
        setSelectedOrderForCancel(null);
        setSelectedReason('');
    }, []);

    const OrderItem = memo(
        ({ order }: { order: OrderHistory }) => {
            // Quản lý trạng thái mở rộng trong chính component này
            const [expanded, setExpanded] = useState(false);

            // Toggle function local
            const handleToggleExpand = () => {
                setExpanded((prev) => !prev);
            };

            // Navigate to order details with order id
            const navigateToDetails = () => {
                if (order.status === "RETURNED") {
                    router.navigate({
                        pathname: "/account/returned_order",
                        params: { orderId: order.id }
                    });
                } else {
                    router.navigate({
                        pathname: "/account/order_details",
                        params: { orderId: order.id }
                    });
                }
            };

            // Check if the order is eligible for return
            const eligibleForReturn = isEligibleForReturn(order);

            return (
                <TouchableOpacity
                    style={styles.orderCard}
                    onPress={navigateToDetails}
                >
                    {/* First product info (always shown) */}
                    <View style={styles.productRow}>
                        {order.lineItems[0]?.variantImage ? (
                            <Image
                                source={{ uri: order.lineItems[0].variantImage }}
                                style={styles.productImage}
                            />
                        ) : (
                            <View style={styles.productImage} />
                        )}
                        <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={1}>
                                {order.lineItems[0]?.productName || "Sản phẩm"}
                            </Text>
                            <View style={styles.containerDetail}>
                                <Text style={styles.productDetails}>
                                    {order.lineItems[0]?.color} {order.lineItems[0]?.size}
                                </Text>
                                <Text style={styles.quantityText}>
                                    x{order.lineItems[0]?.quantity || 0}
                                </Text>
                            </View>
                            <View style={styles.priceRow}>
                                <Text style={styles.price}>
                                    {formatPrice(order.lineItems[0]?.unitPrice || 0)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Additional products (shown only when expanded) */}
                    {expanded &&
                        order.lineItems.slice(1).map((item, index) => (
                            <View
                                key={`item-${index}`}
                                style={[styles.productRow, styles.additionalProductRow]}
                            >
                                {item.variantImage ? (
                                    <Image
                                        source={{ uri: item.variantImage }}
                                        style={styles.productImage}
                                    />
                                ) : (
                                    <View style={styles.productImage} />
                                )}
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName} numberOfLines={1}>
                                        {item.productName || "Sản phẩm"}
                                    </Text>
                                    <View style={styles.containerDetail}>
                                        <Text style={styles.productDetails}>
                                            {item.color} {item.size}
                                        </Text>
                                        <Text style={styles.quantityText}>
                                            x{item.quantity || 0}
                                        </Text>
                                    </View>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.price}>
                                            {formatPrice(item.unitPrice || 0)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}

                    <View style={styles.totalRow}>
                        <Text style={styles.totalText}>
                            Tổng số tiền ({order.lineItems.length} sản phẩm):
                        </Text>
                        <Text style={styles.totalPrice}>
                            {formatPrice(order.finalTotal)}
                        </Text>
                    </View>

                    {/* Action buttons */}
                    <View style={styles.actionRow}>
                        {order.status === "PENDING" && (
                            <CustomButton
                                variant="outlined"
                                title="Hủy đơn"
                                onPress={() => {
                                    openCancelModal(order);
                                }}
                                style={styles.cancelButton}
                                textStyle={styles.cancelButtonText}
                            />
                        )}

                        {activeTab === "DELIVERED" && (
                            <>
                                {eligibleForReturn && (
                                    <CustomButton
                                        variant="filled"
                                        title="Hoàn trả"
                                        onPress={() => { router.navigate(`/account/return_form?orderId=${order.id}`) }}
                                        style={styles.returnButton}
                                        textStyle={styles.returnButtonText}
                                    />
                                )}

                                {order.canReview && !order.isReviewed ? (
                                    <CustomButton
                                        variant="outlined"
                                        title="Đánh giá"
                                        onPress={() => { router.navigate(`/account/reviews?orderId=${order.id}`) }}
                                        style={styles.reviewButton}
                                        textStyle={styles.reviewButtonText}
                                    />
                                ) : order.isReviewed && (
                                    <CustomButton
                                        variant="outlined"
                                        title="Xem đánh giá"
                                        onPress={() => { router.navigate(`/account/list-review?orderId=${order.id}`) }}
                                        style={styles.reviewButton}
                                        textStyle={styles.reviewButtonText}
                                    />
                                )}
                            </>
                        )}
                    </View>

                    {/* Show more button for multiple items */}
                    {order.lineItems.length > 1 && (
                        <TouchableOpacity
                            style={styles.showMoreButton}
                            onPress={handleToggleExpand} // Sử dụng hàm local
                        >
                            <Text style={styles.showMoreText}>
                                {expanded ? "Thu gọn" : "Xem thêm"}
                            </Text>
                            <MaterialCommunityIcons
                                name={expanded ? "chevron-up" : "chevron-down"}
                                size={16}
                                color="#666"
                            />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            );
        },
        (prevProps, nextProps) => {
            const prevOrder = prevProps.order;
            const nextOrder = nextProps.order;
            const prevExpanded = expandedItems[prevOrder.id];
            const nextExpanded = expandedItems[nextOrder.id];

            return prevOrder.id === nextOrder.id && prevExpanded === nextExpanded;
        });

    // Add this useFocusEffect to refresh orders when screen gains focus
    useFocusEffect(
        useCallback(() => {
            // Reset the page for the current tab to refresh from beginning
            setPage(prev => ({ ...prev, [activeTab]: 0 }));
            setOrders(prev => ({ ...prev, [activeTab]: [] }));
            setHasMore(prev => ({ ...prev, [activeTab]: true }));

            // Small delay to ensure state updates complete
            setTimeout(() => {
                fetchData();
            }, 100);

            return () => {
                // Optional cleanup if needed
            };
        }, [activeTab])
    );

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
            <FlatList
                data={orders[activeTab]}
                keyExtractor={keyExtractor}
                renderItem={({ item }) => <OrderItem order={item} />}
                // Tăng giá trị để cải thiện hiệu suất
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={3}
                // Tối ưu load more
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    if (hasMore[activeTab]) {
                        fetchData();
                    }
                }}
                ListEmptyComponent={
                    loading ? null : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
                        </View>
                    )
                }
                ListFooterComponent={
                    <>
                        {loadingMore && (
                            <ActivityIndicator
                                size="small"
                                color={COLOR.PRIMARY}
                                style={styles.loadingMoreIndicator}
                            />
                        )}
                    </>
                }
                contentContainerStyle={[
                    styles.ordersContainer,
                    orders[activeTab].length === 0 && styles.emptyListContainer,
                ]}
                // Bật memoization cho items
                removeClippedSubviews={true}
                updateCellsBatchingPeriod={100}
            />

            {/* Cancel Order Modal (shown first) */}
            <CancelOrderModal
                visible={cancelModalVisible}
                onClose={() => {
                    setCancelModalVisible(false);
                    setSelectedOrderForCancel(null);
                }}
                onConfirm={handleReasonSelected}
                isLoading={false}
            />

            {/* Confirm Dialog (shown after reason selection) */}
            <ConfirmDialog
                visible={confirmModalVisible}
                message={`Bạn có chắc chắn muốn hủy đơn hàng này với lý do "${selectedReason}" không?`}
                onCancel={resetModalStates}
                onConfirm={handleCancelOrder}
            />

            {/* Show loading indicator during cancellation */}
            {cancellingOrder && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={COLOR.PRIMARY} />
                    <Text style={styles.loadingText}>Đang hủy đơn hàng...</Text>
                </View>
            )}

            {/* Alert Modal */}
            <AlertDialog
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
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
    productRow: {
        flexDirection: "row",
        marginBottom: 10,
    },
    productImage: {
        width: 60,
        height: 80,
        borderRadius: 4,
        marginRight: 10,
        backgroundColor: "#f0f0f0",
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
        borderColor: "gray",
        borderWidth: 1,
    },
    reviewButtonText: {
        color: "#333",
        fontSize: 14,
    },
    returnButton: {
        paddingVertical: 10,
        backgroundColor: COLOR.PRIMARY,
    },
    returnButtonText: {
        color: "#fff",
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
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        fontFamily: FONT.LORA,
    },
    loadingMoreIndicator: {
        padding: 10,
        marginBottom: 10,
    },
    loadMoreButton: {
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyListContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    additionalProductRow: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
    },
    cancelButton: {
        paddingVertical: 10,
        borderColor: COLOR.PRIMARY,
        borderWidth: 1,
    },
    cancelButtonText: {
        color: COLOR.PRIMARY,
        fontSize: 14,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    loadingText: {
        color: 'white',
        marginTop: 12,
        fontSize: 16,
        fontFamily: FONT.LORA_MEDIUM,
    },
});

export default OrderHistoryScreen;
