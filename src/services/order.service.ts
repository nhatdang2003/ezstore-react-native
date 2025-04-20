import axios from '@/src/services/instance_axios';
import { PaginatedResponse, Response } from '@/src/types/response.type';
import { OrderReviewRequest, OrderReviewResponse } from '@/src/types/review.type';
import { CheckoutRes, OrderDetailRes, OrderHistory, OrderPreviewReq, OrderPreviewRes } from '@/src/types/order.type';

export const getOrderDetail = (orderId: number): Promise<Response<OrderDetailRes>> => {
    const url = `/api/v1/orders/user/${orderId}`
    return axios.get(url)
}

export const getOrderPreview = (data: OrderPreviewReq): Promise<Response<OrderPreviewRes>> => {
    const url = `api/v1/orders/preview`
    return axios.post(url, data)
}

export const checkoutOrder = (data: OrderPreviewReq): Promise<Response<CheckoutRes>> => {
    const url = `api/v1/orders/check-out`
    return axios.post(url, data)
}

export const getOrderHistoryUser = ({
    page,
    size = 10,
    status,
}: any): Promise<PaginatedResponse<OrderHistory>> => {
    let url = `api/v1/orders/user?page=${page}&size=${size}&sort=createdAt,desc`
    if (status) {
        url += `&filter=status~'${status}'`
    }
    return axios.get(url)
}

export const getOrderReviews = (orderId: number): Promise<Response<OrderReviewResponse[]>> => {
    const url = `api/v1/orders/user/${orderId}/reviews`
    return axios.get(url)
}

export const createOrderReview = (data: OrderReviewRequest): Promise<Response<OrderReviewResponse>> => {
    const url = `api/v1/orders/user/reviews`
    return axios.post(url, data)
}

export const updateOrderReview = (data: OrderReviewRequest): Promise<Response<OrderReviewResponse>> => {
    const url = `api/v1/orders/user/reviews`
    return axios.put(url, data)
}