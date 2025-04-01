import axios from '@/src/services/instance_axios';
import { PaginatedResponse, Response } from '@/src/types/response.type';
import { Product, ProductQueryParams, ProductDetail } from '@/src/types/product.type';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VIEWED_PRODUCTS_KEY = 'viewed_products';
const MAX_VIEWED_PRODUCTS = 20;

export const getProducts = async ({
    search,
    page,
    size = 10,
    categories,
    minPrice,
    maxPrice,
    rating,
    colors,
    sizes,
    sort,
}: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    let url = `api/v1/products?page=${page}&size=${size}`;

    // Add search filter
    if (search) {
        url += `&filter=name~~'*${search}*'`;
    }

    // Add categories filter
    if (categories && categories.length > 0) {
        url += `&filter=category.id in [${categories.join(',')}]`;
    }

    // Add colors filter
    if (colors && colors.length > 0) {
        const colorFilters = colors
            .map(color => `variants.color~'${color}'`)
            .join(" or ");
        url += `&filter=(${colorFilters})`;
    }

    // Add sizes filter
    if (sizes && sizes.length > 0) {
        const sizeFilters = sizes
            .map(size => `variants.size~'${size}'`)
            .join(" or ");
        url += `&filter=(${sizeFilters})`;
    }

    // Add price range filters
    if (minPrice) {
        url += `&minPrice=${minPrice}`;
    }
    if (maxPrice) {
        url += `&maxPrice=${maxPrice}`;
    }

    // Add rating filter
    if (rating && rating.length > 0) {
        const minRating = Math.min(...rating);
        url += `&averageRating=${minRating}`;
    }

    // Add sorting
    if (sort) {
        switch (sort) {
            case 'price-asc':
                url += '&sortField=minPriceWithDiscount&sortOrder=asc';
                break;
            case 'price-desc':
                url += '&sortField=minPriceWithDiscount&sortOrder=desc';
                break;
            case 'newest':
                url += '&sortField=createdAt&sortOrder=desc';
                break;
            case 'popular':
                url += '&isBestSeller=true';
                break;
        }
    }

    return axios.get(url);
};

export const getFeaturedProducts = (): Promise<PaginatedResponse<Product>> => {
    const url = `api/v1/products?filter=isFeatured&size=8`
    return axios.get(url);
};

export const getNewProducts = (): Promise<PaginatedResponse<Product>> => {
    const url = `api/v1/products?sort=createdAt,desc&size=8`
    return axios.get(url);
};

export const getDiscountedProducts = (): Promise<PaginatedResponse<Product>> => {
    const url = `api/v1/products?isDiscounted=true&size=8`
    return axios.get(url);
};

export const getBestSellerProducts = (): Promise<PaginatedResponse<Product>> => {
    const url = `api/v1/products?isBestSeller=true&size=8`
    return axios.get(url);
};

export const getProductDetail = (id: number): Promise<Response<ProductDetail>> => {
    const url = `api/v1/products/ids/${id}`;
    return axios.get(url);
};

export const getSimilarProducts = (categoryId: number): Promise<PaginatedResponse<Product>> => {
    const url = `api/v1/products?filter=category.id:'${categoryId}'&size=8`
    return axios.get(url);
};

export const getRecommendedProducts = (): Promise<PaginatedResponse<Product>> => {
    const url = `api/v1/products?isBestSeller=true&size=8`
    return axios.get(url);
};

export const getViewedProducts = async (): Promise<PaginatedResponse<Product>> => {
    const productIds = await getViewedProductIds();
    return axios.get(`api/v1/products?filter=id in [${productIds.join(',')}]`);
};

export const addToViewedProducts = async (productId: number): Promise<void> => {
    try {
        const currentViewedProducts = await getViewedProductIds();

        const filteredProducts = currentViewedProducts.filter(id => id !== productId);

        const updatedViewedProducts = [productId, ...filteredProducts];

        const limitedViewedProducts = updatedViewedProducts.slice(0, MAX_VIEWED_PRODUCTS);

        await AsyncStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(limitedViewedProducts));
    } catch (error) {
        console.error('Lỗi khi lưu sản phẩm đã xem:', error);
    }
};

export const getViewedProductIds = async (): Promise<number[]> => {
    try {
        const viewedProductsJson = await AsyncStorage.getItem(VIEWED_PRODUCTS_KEY);
        return viewedProductsJson ? JSON.parse(viewedProductsJson) : [];
    } catch (error) {
        console.error('Lỗi khi đọc danh sách sản phẩm đã xem:', error);
        return [];
    }
};

export const clearViewedProducts = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(VIEWED_PRODUCTS_KEY);
    } catch (error) {
        console.error('Lỗi khi xóa lịch sử sản phẩm đã xem:', error);
    }
};
