import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  Pressable,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FONT } from "@/src/constants/font";
import { useLocalSearchParams, useRouter, useSegments } from "expo-router";
import CustomSwitch from "@/src/components/CustomSwitch";
import { getOrderPreview, checkoutOrder } from "@/src/services/order.service";
import { OrderPreviewRes } from "@/src/types/order.type";
import AlertDialog from "@/src/components/AlertModal";
import { PaymentMethod, DeliveryMethod } from "@/src/constants/order";
import { getDefaultShippingProfile } from "@/src/services/shipping-profile.service";

const CheckoutScreen = () => {
  const router = useRouter();
  const segments = useSegments();
  const params = useLocalSearchParams();

  // Lấy cartItemIds từ params
  const cartItemIds = params.cartItemIds
    ? JSON.parse(params.cartItemIds as string)
    : [];
  const selectedID = params.selectedID;

  // State cho các giá trị
  const [selectedPayment, setSelectedPayment] = useState(PaymentMethod.COD);
  const [selectedDelivery, setSelectedDelivery] = useState(DeliveryMethod.GHN);
  const [usePoints, setUsePoints] = useState(false);
  const [shippingProfileId, setShippingProfileId] = useState<number | null>(
    null
  );
  const [orderPreview, setOrderPreview] = useState<OrderPreviewRes | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Note state
  const [note, setNote] = useState("");

  // Fetch order preview data
  const fetchOrderPreview = async () => {
    try {
      setLoading(true);
      const response = await getOrderPreview({
        shippingProfileId: Number(selectedID) ?? shippingProfileId,
        cartItemIds,
        note,
        paymentMethod: selectedPayment,
        deliveryMethod: selectedDelivery,
        isUsePoint: usePoints,
      });

      setShippingProfileId(response.data?.shippingProfile?.id);
      setOrderPreview(response.data);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin đơn hàng:", err);
      setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.");
      setAlertMessage(
        "Không thể tải thông tin đơn hàng. Vui lòng thử lại sau."
      );
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    if (cartItemIds.length > 0) {
      fetchOrderPreview();
    } else {
      setError("Không có sản phẩm nào được chọn để thanh toán");
      router.back();
    }
  }, [usePoints, selectedDelivery]);

  // Kiểm tra địa chỉ mặc định khi component mount
  useEffect(() => {
    const checkDefaultAddress = async () => {
      try {
        const response = await getDefaultShippingProfile();
        if (!response.data) {
          // Nếu không có địa chỉ mặc định, chuyển hướng đến trang thêm địa chỉ
          router.replace("/account/add_address");
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra địa chỉ mặc định:", error);
        router.replace("/account/add_address");
      }
    };

    checkDefaultAddress();
  }, []);

  // Xử lý nút thanh toán
  const handlePayment = async () => {
    try {
      // Kiểm tra xem có địa chỉ giao hàng không
      if (!orderPreview?.shippingProfile) {
        setAlertMessage("Vui lòng chọn địa chỉ giao hàng");
        setAlertVisible(true);
        return;
      }

      setLoading(true);

      // Gọi API thanh toán
      const response = await checkoutOrder({
        shippingProfileId,
        cartItemIds,
        note,
        paymentMethod: selectedPayment,
        deliveryMethod: selectedDelivery,
        isUsePoint: usePoints,
      });

      // Xử lý kết quả dựa trên phương thức thanh toán
      if (selectedPayment === PaymentMethod.COD) {
        // Với COD, điều hướng ngay đến trang success hoặc fail
        if (response.statusCode === 200) {
          router.replace({
            pathname: "/payment/success",
            params: {
              orderId: response.data.orderId,
              orderCode: response.data.code,
            }
          });
        } else {
          router.replace({
            pathname: "/payment/fail",
            params: {
              message: "Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.",
            },
          });
        }
      } else if (selectedPayment === PaymentMethod.VNPAY) {
        // Với VNPAY, điều hướng đến trang payment với URL thanh toán
        if (response.data.paymentUrl) {
          router.replace({
            pathname: "/payment/payment",
            params: {
              orderId: response.data.orderId,
              orderCode: response.data.code,
              paymentUrl: response.data.paymentUrl
            },
          });
        } else {
          router.replace({
            pathname: "/payment/fail",
            params: {
              message: "Không thể khởi tạo cổng thanh toán. Vui lòng thử lại.",
            },
          });
        }
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      setAlertMessage(
        "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau."
      );
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị loading khi đang tải
  if (loading && !orderPreview) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="black" />
        <Text style={{ marginTop: 16, fontFamily: FONT.LORA_MEDIUM }}>
          Đang tải thông tin đơn hàng...
        </Text>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={styles.placeholder} />
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="black" />
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Delivery Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thông tin nhận hàng</Text>
            <TouchableOpacity
              onPress={() => {
                router.replace({
                  pathname: "/cart/choose_address",
                  params: {
                    selectedID: shippingProfileId,
                    cartItemIds: JSON.stringify(cartItemIds),
                  },
                });
              }}
            >
              <Text style={styles.editButton}>Sửa</Text>
            </TouchableOpacity>
          </View>

          {orderPreview?.shippingProfile ? (
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryName}>
                {orderPreview.shippingProfile.firstName}{" "}
                {orderPreview.shippingProfile.lastName}
              </Text>
              <Text style={styles.deliveryAddress}>
                {orderPreview.shippingProfile.address},{" "}
                {orderPreview.shippingProfile.ward},{" "}
                {orderPreview.shippingProfile.district},{" "}
                {orderPreview.shippingProfile.province}
              </Text>
              <Text style={styles.deliveryPhone}>
                {orderPreview.shippingProfile.phoneNumber}
              </Text>
            </View>
          ) : (
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryName}>Chưa có địa chỉ giao hàng</Text>
              <TouchableOpacity style={styles.addAddressButton}>
                <Text style={styles.addAddressText}>+ Thêm địa chỉ</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Selected Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm đã chọn</Text>

          {orderPreview?.lineItems.map((item) => (
            <View key={item.cartItemId} style={styles.productItem}>
              <Image
                source={{ uri: item.productVariant.image || item.image }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.productVariant}>
                  Màu: {item.productVariant.color}, Kích thước:{" "}
                  {item.productVariant.size}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={styles.currentPrice}>
                    {item.finalPrice.toLocaleString()}đ
                  </Text>
                  {item.discountRate > 0 && (
                    <Text style={styles.originalPrice}>
                      {item.price.toLocaleString()}đ
                    </Text>
                  )}
                </View>
                <Text style={styles.quantity}>Số lượng: {item.quantity}</Text>
                <Text style={styles.totalPrice}>
                  Tổng: {(item.finalPrice * item.quantity).toLocaleString()}đ
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Note Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú đơn hàng</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Nhập ghi chú cho đơn hàng"
            value={note}
            onChangeText={setNote}
            multiline={true}
            numberOfLines={1}
            textAlignVertical="top"
          />
        </View>

        {/* Delivery Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức giao hàng</Text>

          {/* GHN Option */}
          <TouchableOpacity
            style={styles.paymentOption}
            onPress={() => setSelectedDelivery(DeliveryMethod.GHN)}
          >
            <View style={styles.paymentIconContainer}>
              <MaterialCommunityIcons
                name="truck-delivery"
                size={30}
                color="black"
              />
            </View>
            <Text style={styles.paymentText}>Giao hàng tiêu chuẩn (GHN)</Text>
            <View
              style={[
                styles.radioButton,
                selectedDelivery === DeliveryMethod.GHN &&
                styles.radioButtonSelected,
              ]}
            >
              {selectedDelivery === DeliveryMethod.GHN && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>

          {/* EXPRESS Option */}
          <TouchableOpacity
            style={styles.paymentOption}
            onPress={() => setSelectedDelivery(DeliveryMethod.EXPRESS)}
          >
            <View style={styles.paymentIconContainer}>
              <MaterialCommunityIcons name="rocket" size={30} color="black" />
            </View>
            <Text style={styles.paymentText}>Giao hàng hỏa tốc</Text>
            <View
              style={[
                styles.radioButton,
                selectedDelivery === DeliveryMethod.EXPRESS &&
                styles.radioButtonSelected,
              ]}
            >
              {selectedDelivery === DeliveryMethod.EXPRESS && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Payment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

          {/* COD Option */}
          <TouchableOpacity
            style={styles.paymentOption}
            onPress={() => setSelectedPayment(PaymentMethod.COD)}
          >
            <View style={styles.paymentIconContainer}>
              <MaterialCommunityIcons name="cash" size={30} color="black" />
            </View>
            <Text style={styles.paymentText}>Thanh toán khi nhận hàng</Text>
            <View
              style={[
                styles.radioButton,
                selectedPayment === PaymentMethod.COD &&
                styles.radioButtonSelected,
              ]}
            >
              {selectedPayment === PaymentMethod.COD && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>

          {/* VnPay Option */}
          <TouchableOpacity
            style={styles.paymentOption}
            onPress={() => setSelectedPayment(PaymentMethod.VNPAY)}
          >
            <View style={styles.paymentIconContainer}>
              <Image
                source={require("@/src/assets/images/vnpay.png")}
                style={styles.paymentIcon}
              />
            </View>
            <Text style={styles.paymentText}>VNPay</Text>
            <View
              style={[
                styles.radioButton,
                selectedPayment === PaymentMethod.VNPAY &&
                styles.radioButtonSelected,
              ]}
            >
              {selectedPayment === PaymentMethod.VNPAY && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Points Section */}
        {orderPreview && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Điểm thưởng</Text>
            <View style={styles.pointsContainer}>
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsText}>Điểm hiện có: {orderPreview.points}</Text>
                <Text style={styles.pointsValue}>
                  (Tương đương {(orderPreview.points).toLocaleString()}đ)
                </Text>
              </View>
              <CustomSwitch
                value={usePoints}
                onValueChange={(newValue) => {
                  setUsePoints(newValue);
                }}
              />
            </View>
          </View>
        )}

        {/* Payment Summary */}
        {orderPreview && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tổng tiền hàng</Text>
              <Text style={styles.summaryValue}>
                {orderPreview.lineItems
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toLocaleString()}
                đ
              </Text>
            </View>

            {orderPreview.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.discountLabel]}>
                  Giảm giá
                </Text>
                <Text style={styles.discountValue}>
                  -{orderPreview.discount.toLocaleString()}đ
                </Text>
              </View>
            )}

            {orderPreview.pointDiscount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.discountLabel]}>
                  Sử dụng điểm
                </Text>
                <Text style={styles.discountValue}>
                  -{orderPreview.pointDiscount.toLocaleString()}đ
                </Text>
              </View>
            )}

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
              <Text style={styles.summaryValue}>
                {orderPreview.shippingFee.toLocaleString()}đ
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalSummaryLabel}>Tổng thanh toán</Text>
              <Text style={styles.totalSummaryValue}>
                {orderPreview.finalTotal.toLocaleString()}đ
              </Text>
            </View>
          </View>
        )}

        {/* Total and Pay Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <Text style={styles.payButtonText}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AlertDialog
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
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
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: FONT.LORA_MEDIUM,
    fontSize: 20,
    marginBottom: 16,
  },
  addAddressButton: {
    marginTop: 8,
    padding: 8,
  },
  addAddressText: {
    color: "#007AFF",
    fontSize: 16,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  paymentIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentIcon: {
    width: 30,
    height: 24,
    resizeMode: "contain",
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#000",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
  },
  editButton: {
    color: "#888",
    fontSize: 14,
  },
  deliveryInfo: {
    gap: 4,
  },
  deliveryName: {
    fontSize: 16,
    fontWeight: "500",
  },
  deliveryAddress: {
    fontSize: 16,
    color: "#666",
  },
  deliveryPhone: {
    fontSize: 16,
    color: "#666",
  },
  // Points styles
  pointsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointsInfo: {
    flex: 1,
  },
  pointsText: {
    fontSize: 16,
    fontFamily: FONT.LORA_MEDIUM,
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 14,
    color: "#666",
  },
  // Product styles
  productItem: {
    flexDirection: "row",
    marginBottom: 16,
    paddingBottom: 16,
  },
  productImage: {
    width: 90,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: FONT.LORA_MEDIUM,
  },
  productVariant: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  currentPrice: {
    fontSize: 16,
    fontFamily: FONT.LORA_MEDIUM,
    color: "#e53935",
  },
  originalPrice: {
    fontSize: 14,
    fontFamily: FONT.LORA_MEDIUM,
    color: "#999",
    textDecorationLine: "line-through",
  },
  quantity: {
    fontSize: 14,
    fontFamily: FONT.LORA_MEDIUM,
    color: "#666",
  },
  totalPrice: {
    fontSize: 16,
    fontFamily: FONT.LORA_MEDIUM,
    marginTop: 4,
  },
  // Summary styles
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  discountLabel: {
    color: "#4caf50",
  },
  discountValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4caf50",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 12,
  },
  totalSummaryLabel: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: FONT.LORA_MEDIUM,
  },
  totalSummaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: FONT.LORA_MEDIUM,
  },
  // Footer styles
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  totalLabel: {
    fontSize: 20,
    fontFamily: FONT.LORA_MEDIUM,
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: FONT.LORA_MEDIUM,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  payButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 30,
  },
});

export default CheckoutScreen;
