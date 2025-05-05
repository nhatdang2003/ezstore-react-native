export interface OrderPreviewReq {
    shippingProfileId: number | null,
    cartItemIds: number[],
    note: string,
    paymentMethod: string,
    deliveryMethod: string,
    isUsePoint: boolean
}

export interface OrderPreviewRes {
    shippingProfile: ShippingProfile,
    lineItems: LineItem[],
    finalTotal: number,
    shippingFee: number,
    discount: number,
    pointDiscount: number,
    points: number
}

export interface CheckoutRes {
    orderId: number,
    code: string,
    status: string,
    paymentStatus: string,
    paymentMethod: string,
    paymentUrl: string
}

interface ShippingProfile {
    id: number,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    address: string,
    wardId: number,
    ward: string,
    districtId: number,
    district: string,
    provinceId: number,
    province: string,
    default: boolean
}

interface LineItem {
    cartItemId: number,
    productId: number,
    slug: string,
    productName: string,
    productVariant: ProductVariant,
    price: number,
    discountRate: number,
    finalPrice: number,
    quantity: number,
    inStock: number,
    image: string
}

interface ProductVariant {
    id: number,
    color: string,
    size: string,
    image: string
}

export interface OrderLineItem {
    id: number;
    productName: string;
    color: string;
    size: string;
    variantImage: string;
    quantity: number;
    unitPrice: number;
    discount: number;
}

export interface OrderHistory {
    id: number;
    code: string;
    orderDate: string;
    status:
    | "PENDING"
    | "PROCESSING"
    | "SHIPPING"
    | "DELIVERED"
    | "CANCELLED"
    | "RETURNED";
    paymentMethod: "COD" | "VNPAY";
    paymentStatus: "PENDING" | "SUCCESS" | "FAILED";
    lineItems: OrderLineItem[];
    total: number;
    shippingFee: number;
    discount: number;
    finalTotal: number;
    canReview: boolean;
    isReviewed: boolean;
    cancelReason: string | null;
    statusUpdateTimestamp: string;
}

export interface OrderDetailRes {
    id: number;
    code: string;
    orderDate: string;
    status:
    | "PENDING"
    | "PROCESSING"
    | "SHIPPING"
    | "DELIVERED"
    | "CANCELLED"
    | "RETURNED";
    paymentMethod: "COD" | "VNPAY";
    paymentStatus: "PENDING" | "SUCCESS" | "FAILED";
    paymentDate: string;
    deliveryMethod: "GHN" | "EXPRESS";
    lineItems: OrderLineItem[];
    total: number;
    shippingFee: number;
    discount: number;
    finalTotal: number;
    canReview: boolean;
    isReviewed: boolean;
    cancelReason: string | null;
    shippingProfile: ShippingProfile;
    statusUpdateTimestamp: string;
}

export interface OrderStatisticsSummaryRequest {
    startDate: string;
    endDate: string;
}

export interface OrderStatisticsSummaryResponse {
    totalAmount: number;
    totalOrderCount: number;

    statusBreakdown: {
        pending: {
            count: number,
            amount: number
        },
        processing: {
            count: number,
            amount: number
        },
        shipping: {
            count: number,
            amount: number
        },
        delivered: {
            count: number,
            amount: number
        }
    }
}

export interface MonthlySpendingChartResponse {
    labels: string[];  // e.g. ["7/23", "8/23", "9/23"]
    values: number[];
    counts: number[];
}

export interface StatusSpendingChartResponse {
    pending: number;
    processing: number;
    shipping: number;
    delivered: number;
}
