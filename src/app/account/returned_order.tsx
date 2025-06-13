import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLOR } from "@/src/constants/color";
import * as Clipboard from 'expo-clipboard';
import { FONT } from "@/src/constants/font";
import { router, useLocalSearchParams } from "expo-router";
const Modal = require("react-native-modal").default;
import { getReturnRequestById, cancelReturnRequest, getReturnRequestByOrderId } from "@/src/services/return-request.service";
import { ReturnRequestRes } from "@/src/types/return-request.type";
import { formatPrice } from "@/src/utils/product";
import ConfirmDialog from "@/src/components/ConfirmModal";
import AlertDialog from "@/src/components/AlertModal";
import MediaViewer from "@/src/components/MediaViewer";

const STATE_COLORS = {
    disabled: "#ccc",
    pending: "#FFA500",
    success: "#4CAF50",
    error: "#F44336",
    cancelled: "#888888"
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ReturnedOrderScreen() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [returnRequest, setReturnRequest] = useState<ReturnRequestRes | null>(null);
    const [loading, setLoading] = useState(true);
    const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
    const [isAlertModalVisible, setAlertModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [cancelling, setCancelling] = useState(false);

    const { orderId, returnRequestId } = useLocalSearchParams<{ orderId: string, returnRequestId: string }>();

    useEffect(() => {
        const fetchReturnRequest = async () => {
            try {
                // If returnRequestId is provided, fetch that specific return request
                if (returnRequestId) {
                    const response = await getReturnRequestById(Number(returnRequestId));
                    setReturnRequest(response.data);
                }
                // If only orderId is provided, fetch return request for that order
                else if (orderId) {
                    const response = await getReturnRequestByOrderId(Number(orderId));
                    setReturnRequest(response.data);
                }
            } catch (error) {
                console.error("Error fetching return request:", error);
                setAlertMessage("Không thể tải thông tin yêu cầu hoàn trả");
                setAlertModalVisible(true);
            } finally {
                setLoading(false);
            }
        };

        fetchReturnRequest();
    }, [orderId, returnRequestId]);

    const handleCancelReturnRequest = async () => {
        if (!returnRequest) return;

        setCancelling(true);
        try {
            await cancelReturnRequest(returnRequest.id);

            setAlertMessage("Đã hủy yêu cầu hoàn trả thành công");
            setAlertModalVisible(true);

            // Navigate back or refresh the data
            router.back();
        } catch (error) {
            console.error("Error cancelling return request:", error);

            setAlertMessage("Không thể hủy yêu cầu hoàn trả");
            setAlertModalVisible(true);
        } finally {
            setCancelling(false);
            setConfirmModalVisible(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={COLOR.PRIMARY} />
                <Text style={styles.loadingText}>Đang tải thông tin yêu cầu hoàn trả...</Text>
            </SafeAreaView>
        );
    }

    if (!returnRequest) {
        return (
            <SafeAreaView style={[styles.container, styles.loadingContainer]}>
                <Text style={styles.errorText}>Không tìm thấy thông tin yêu cầu hoàn trả</Text>
                <TouchableOpacity
                    style={styles.backHomeButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backHomeButtonText}>Quay lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    // Set default cashBackStatus to 'ACCEPTED' if status is 'APPROVED' but no cashBackStatus is provided
    const cashBackStatus = returnRequest.status === 'APPROVED' && !returnRequest.cashBackStatus
        ? 'ACCEPTED'
        : returnRequest.cashBackStatus;

    // Determine the status color based on the return request status
    const getStatusColor = () => {
        switch (returnRequest.status) {
            case 'PENDING':
                return STATE_COLORS.pending;
            case 'APPROVED':
                return STATE_COLORS.success;
            case 'REJECTED':
                return STATE_COLORS.error;
            case 'CANCELED':
                return STATE_COLORS.cancelled;
            default:
                return STATE_COLORS.disabled;
        }
    };

    // Get the status text to display
    const getStatusText = () => {
        switch (returnRequest.status) {
            case 'PENDING':
                return 'Đang chờ xác nhận';
            case 'APPROVED':
                return 'Chấp nhận hoàn tiền';
            case 'REJECTED':
                return 'Từ chối hoàn tiền';
            case 'CANCELED':
                return 'Đã hủy yêu cầu';
            default:
                return 'Không xác định';
        }
    };

    return (
        <>
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
                    {/* Shipping Information */}
                    <View style={{ ...styles.statusContainer, backgroundColor: getStatusColor() }}>
                        <Text style={styles.statusText}>{getStatusText()}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={{ marginBottom: 8, fontWeight: "500" }}>Yêu cầu hoàn tiền</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            {/* Pending status */}
                            <View style={{ width: 90, justifyContent: 'center', alignItems: "center", gap: 8 }}>
                                <View style={{
                                    borderColor: returnRequest.status !== 'PENDING' ? STATE_COLORS.disabled : STATE_COLORS.pending,
                                    borderWidth: 2,
                                    borderRadius: 50,
                                    padding: 8
                                }}>
                                    <MaterialCommunityIcons
                                        name="dots-horizontal"
                                        size={24}
                                        color={returnRequest.status !== 'PENDING' ? STATE_COLORS.disabled : STATE_COLORS.pending}
                                    />
                                </View>
                                <Text style={{ textAlign: 'center' }}>Chờ xác nhận</Text>
                            </View>

                            {/* Canceled status */}
                            <View style={{ width: 80, justifyContent: 'center', alignItems: "center", gap: 8 }}>
                                <View style={{
                                    borderColor: returnRequest.status === 'CANCELED' ? STATE_COLORS.cancelled : STATE_COLORS.disabled,
                                    borderWidth: 2,
                                    borderRadius: 50,
                                    padding: 8
                                }}>
                                    <MaterialCommunityIcons
                                        name="cancel"
                                        size={24}
                                        color={returnRequest.status === 'CANCELED' ? STATE_COLORS.cancelled : STATE_COLORS.disabled}
                                    />
                                </View>
                                <Text style={{ textAlign: 'center' }}>Đã hủy</Text>
                            </View>

                            {/* Rejected status */}
                            <View style={{ width: 80, justifyContent: 'center', alignItems: "center", gap: 8 }}>
                                <View style={{
                                    borderColor: returnRequest.status === 'REJECTED' ? STATE_COLORS.error : STATE_COLORS.disabled,
                                    borderWidth: 2,
                                    borderRadius: 50,
                                    padding: 8
                                }}>
                                    <MaterialCommunityIcons
                                        name="close"
                                        size={24}
                                        color={returnRequest.status === 'REJECTED' ? STATE_COLORS.error : STATE_COLORS.disabled}
                                    />
                                </View>
                                <Text style={{ textAlign: 'center' }}>Từ chối</Text>
                            </View>

                            {/* Approved status */}
                            <View style={{ width: 80, justifyContent: 'center', alignItems: "center", gap: 8 }}>
                                <View style={{
                                    borderColor: returnRequest.status === 'APPROVED' ? STATE_COLORS.success : STATE_COLORS.disabled,
                                    borderWidth: 2,
                                    borderRadius: 50,
                                    padding: 8
                                }}>
                                    <MaterialCommunityIcons
                                        name="check"
                                        size={24}
                                        color={returnRequest.status === 'APPROVED' ? STATE_COLORS.success : STATE_COLORS.disabled}
                                    />
                                </View>
                                <Text style={{ textAlign: 'center' }}>Chấp nhận</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {returnRequest.status === 'APPROVED' && (
                            <>
                                <Text style={{ marginBottom: 8, fontWeight: "500" }}>Quá trình hoàn tiền</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <View style={{ width: 100, justifyContent: 'center', alignItems: "center", gap: 8 }}>
                                        <View style={{
                                            borderColor: STATE_COLORS.success,
                                            borderWidth: 2,
                                            borderRadius: 50,
                                            padding: 8
                                        }}>
                                            <MaterialCommunityIcons name="check" size={24} color={STATE_COLORS.success} />
                                        </View>
                                        <Text style={{ textAlign: 'center' }}>Chấp nhận hoàn tiền</Text>
                                    </View>

                                    <View style={{ width: 100, justifyContent: 'center', alignItems: "center", gap: 8 }}>
                                        <View style={{
                                            borderColor:
                                                cashBackStatus === 'IN_PROGRESS' || cashBackStatus === 'COMPLETED'
                                                    ? STATE_COLORS.success
                                                    : STATE_COLORS.disabled,
                                            borderWidth: 2,
                                            borderRadius: 50,
                                            padding: 8
                                        }}>
                                            <MaterialCommunityIcons
                                                name="bank-outline"
                                                size={24}
                                                color={
                                                    cashBackStatus === 'IN_PROGRESS' || cashBackStatus === 'COMPLETED'
                                                        ? STATE_COLORS.success
                                                        : STATE_COLORS.disabled
                                                }
                                            />
                                        </View>
                                        <Text style={{ textAlign: 'center' }}>Đang hoàn tiền</Text>
                                    </View>

                                    <View style={{ width: 100, justifyContent: 'center', alignItems: "center", gap: 8 }}>
                                        <View style={{
                                            borderColor: cashBackStatus === 'COMPLETED' ? STATE_COLORS.success : STATE_COLORS.disabled,
                                            borderWidth: 2,
                                            borderRadius: 50,
                                            padding: 8
                                        }}>
                                            <MaterialCommunityIcons
                                                name="credit-card-plus-outline"
                                                size={24}
                                                color={cashBackStatus === 'COMPLETED' ? STATE_COLORS.success : STATE_COLORS.disabled}
                                            />
                                        </View>
                                        <Text style={{ textAlign: 'center' }}>Đã hoàn tiền</Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>

                    {/* Product Information */}
                    <View style={styles.card}>
                        {returnRequest.orderItems && returnRequest.orderItems.length > 0 && (
                            <View style={styles.productRow}>
                                <Image
                                    source={{
                                        uri: returnRequest.orderItems[0].variantImage || "https://via.placeholder.com/80",
                                    }}
                                    style={styles.productImage}
                                />
                                <View style={styles.productDetails}>
                                    <Text style={styles.productName} numberOfLines={2}>
                                        {returnRequest.orderItems[0].productName}
                                    </Text>
                                    <Text style={styles.productVariant}>
                                        Màu: {returnRequest.orderItems[0].color}
                                    </Text>
                                    <Text style={styles.productVariant}>
                                        Kích thước: {returnRequest.orderItems[0].size}
                                    </Text>
                                    <View style={styles.quantityPriceRow}>
                                        <Text style={styles.quantity}>x{returnRequest.orderItems[0].quantity}</Text>
                                        <View style={styles.priceContainer}>
                                            {returnRequest.orderItems[0].discount > 0 && (
                                                <Text style={styles.originalPrice}>
                                                    {formatPrice(returnRequest.orderItems[0].unitPrice)}
                                                </Text>
                                            )}
                                            <Text style={styles.discountedPrice}>
                                                {formatPrice(returnRequest.orderItems[0].unitPrice - returnRequest.orderItems[0].discount)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        <View style={styles.divider} />

                        <View style={{ gap: 4 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                                <Text style={{ color: '#666' }}>Tổng tiền hoàn:</Text>
                                <Text>
                                    {returnRequest.orderItems && returnRequest.orderItems.length > 0
                                        ? formatPrice(
                                            returnRequest.orderItems.reduce((total, item) =>
                                                total + ((item.unitPrice - item.discount) * item.quantity), 0)
                                        )
                                        : "0đ"}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                                <Text style={{ color: '#666' }}>Hoàn tiền vào:</Text>
                                <Text numberOfLines={1} style={{ flex: 1, textAlign: 'right' }}>
                                    {returnRequest.accountNumber} - {returnRequest.bankName}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                                <Text style={{ color: '#666' }}>Ngày yêu cầu:</Text>
                                <Text>{new Date(returnRequest.createdAt).toLocaleDateString('vi-VN')}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                                <Text style={{ color: '#666' }}>Lý do hoàn tiền:</Text>
                                <Text numberOfLines={1} style={{ flex: 1, textAlign: 'right' }}>{returnRequest.reason}</Text>
                            </View>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', alignSelf: "flex-end" }}
                                onPress={() => { setModalVisible(true) }}>
                                <Text style={{ color: '#666' }}>Chi tiết</Text>
                                <MaterialCommunityIcons name="chevron-right" size={20} color="#666" />
                            </TouchableOpacity>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center', gap: 8 }}>
                                <Text style={{ color: '#666' }}>Mã đơn hàng:</Text>
                                <View style={styles.orderIdValue}>
                                    <Text style={styles.orderId}>{returnRequest.orderCode}</Text>
                                    <TouchableOpacity
                                        style={styles.copyButton}
                                        onPress={async () => {
                                            await Clipboard.setStringAsync(returnRequest.orderCode);
                                            setAlertMessage("Đã sao chép mã đơn hàng");
                                            setAlertModalVisible(true);
                                        }}
                                    >
                                        <Text style={styles.copyButtonText}>SAO CHÉP</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Add Cancel Return Request Button if status is PENDING */}
                {returnRequest && returnRequest.status === 'PENDING' && (
                    <View style={styles.bottomButtons}>
                        <TouchableOpacity
                            style={styles.cancelReturnButton}
                            onPress={() => setConfirmModalVisible(true)}
                            disabled={cancelling}
                        >
                            {cancelling ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <Text style={styles.cancelReturnButtonText}>Hủy yêu cầu hoàn trả</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>

            {/* Detail modal for reason */}
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
                style={{
                    justifyContent: "flex-end",
                    margin: 0,
                }}
                avoidKeyboard={false}
                backdropTransitionOutTiming={0}
                statusBarTranslucent
                useNativeDriverForBackdrop
            >
                <View style={{ maxHeight: 0.8 * SCREEN_HEIGHT, gap: 8, backgroundColor: "white", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: "#eee",
                    }}>
                        <View style={{ width: 1 }} />
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>Chi tiết lý do</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <MaterialCommunityIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ padding: 16, paddingTop: 4, gap: 8 }}>
                        <View>
                            <Text style={{ color: '#666' }}>Lý do</Text>
                            <Text>{returnRequest.reason}</Text>
                        </View>
                        {returnRequest.imageUrls && returnRequest.imageUrls.length > 0 && (
                            <MediaViewer 
                                mediaItems={returnRequest.imageUrls.map(url => ({ 
                                    type: 'image' as const, 
                                    url 
                                }))} 
                            />
                        )}
                        {returnRequest.adminComment && (
                            <View style={{ padding: 8, borderRadius: 8, backgroundColor: '#eee', marginVertical: 8 }}>
                                <Text style={{ fontWeight: "500" }}>Phản hồi của cửa hàng</Text>
                                <Text>{returnRequest.adminComment}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Confirmation Modal */}
            <ConfirmDialog
                visible={isConfirmModalVisible}
                message="Bạn có chắc chắn muốn hủy yêu cầu hoàn trả này không?"
                onCancel={() => setConfirmModalVisible(false)}
                onConfirm={handleCancelReturnRequest}
            />

            {/* Alert Modal */}
            <AlertDialog
                visible={isAlertModalVisible}
                message={alertMessage}
                onClose={() => setAlertModalVisible(false)}
            />
        </>
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
    errorText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    backHomeButton: {
        backgroundColor: COLOR.PRIMARY,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    backHomeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
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
        height: 120,
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
    cancelReturnButton: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        backgroundColor: COLOR.PRIMARY,
    },
    cancelReturnButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "white",
    },
});