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