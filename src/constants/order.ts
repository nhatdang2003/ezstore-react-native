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