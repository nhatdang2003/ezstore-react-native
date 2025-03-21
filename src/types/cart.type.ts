export interface CartItem {
    cartItemId: number;
    productId: number;
    slug: string;
    productName: string,
    productVariant: ProductVariant
    price: number;
    discountRate: number;
    finalPrice: number;
    quantity: number;
    inStock: number;
    image: string
}

interface ProductVariant {
    id: number;
    color: string;
    size: string;
    image: string;
}