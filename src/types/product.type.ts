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