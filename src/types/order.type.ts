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