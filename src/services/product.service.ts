import axios from '@/src/services/instance_axios';
import { ProductResponse } from '@/src/types/product.type';

export const getFeaturedProducts = (): Promise<ProductResponse> => {
    const url = `api/v1/products?filter=isFeatured&size=8`
    return axios.get(url);
};

export const getNewProducts = (): Promise<ProductResponse> => {
    const url = `api/v1/products?sort=createdAt,desc&size=8`
    return axios.get(url);
};

export const getDiscountedProducts = (): Promise<ProductResponse> => {
    const url = `api/v1/products?isDiscounted=true&size=8`
    return axios.get(url);
};
