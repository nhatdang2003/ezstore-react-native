import axios from '@/src/services/instance_axios';
import { PaginatedResponse, Response } from '@/src/types/response.type';
import { Product, ProductQueryParams, ProductDetail } from '@/src/types/product.type';

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
    const url = `api/v1/products?filter=category.id~'${categoryId}'&size=8`
    return axios.get(url);
};

export const getRecommendedProducts = (): Promise<PaginatedResponse<Product>> => {
    const url = `api/v1/products?isBestSeller=true&size=8`
    return axios.get(url);
};
