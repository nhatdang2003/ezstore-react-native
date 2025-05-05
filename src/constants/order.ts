export const PaymentMethod = {
    COD: "COD",
    VNPAY: "VNPAY"
};

export const DeliveryMethod = {
    GHN: "GHN",
    EXPRESS: "EXPRESS"
};

export const STATUS_ORDER = [
    {
        value: "PENDING",
        label: "Chờ xác nhận",
    },
    {
        value: "PROCESSING",
        label: "Đang xử lý",
    },
    {
        value: "SHIPPING",
        label: "Đang giao hàng",
    },
    {
        value: "DELIVERED",
        label: "Đã giao hàng",
    },
    { value: "CANCELLED", label: "Đã hủy", color: "bg-red-100 text-red-800" },
    {
        value: "RETURNED",
        label: "Đã hoàn trả",
    },
] as const;

// Cancellation reasons
export const CANCEL_REASONS = [
    "Thay đổi địa chỉ giao hàng",
    "Muốn thay đổi phương thức thanh toán",
    "Muốn đặt lại sản phẩm khác",
    "Tìm thấy nơi bán giá tốt hơn",
    "Không có nhu cầu mua nữa",
    "Lý do khác"
];