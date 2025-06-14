export interface ProductCardProps {
    id: string;
    image: string;
    title: string;
    price: number;
    priceDiscount?: number;
    rating: number;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    priceWithDiscount: number;
    averageRating: number;
    images: string[];
}

export interface ProductQueryParams {
    search?: string;
    page: number;
    size?: number;
    categories?: number[];
    minPrice?: number | string;
    maxPrice?: number | string;
    rating?: number[];
    colors?: string[];
    sizes?: string[];
    sort?: string;
}

export interface ProductVariant {
    id: number;
    color: string;
    size: string;
    quantity: number;
    currentUserCartQuantity: number;
    differencePrice: number;
    images: string[];
}

export interface ProductDetail {
    id: number;
    name: string;
    description: string;
    price: number;
    minPrice: number;
    maxPrice: number;
    priceWithDiscount: number;
    minPriceWithDiscount: number;
    maxPriceWithDiscount: number;
    categoryId: number;
    categoryName: string;
    discountRate: number;
    averageRating: number;
    numberOfReviews: number;
    numberOfSold: number;
    slug: string;
    colorDefault: string | null;
    images: string[];
    variants: ProductVariant[];
    featured: boolean;
}

export interface ProductReview {
    reviewId: number;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
    rating: number;
    createdAt: string;
    variant: {
        variantId: number;
        color: string;
        size: string;
    };
    description: string;
    imageUrls: string[];
    videoUrl: string;
}