export interface ProductCardProps {
    id: string;
    image: string;
    title: string;
    price: number;
    priceDiscount?: number;
    rating: number;
}

interface Meta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    priceWithDiscount: number;
    averageRating: number;
    images: string[];
}

export interface ProductResponse {
    statusCode: number;
    error: null | string;
    message: string;
    data: {
        meta: Meta;
        data: Product[];
    };
}
