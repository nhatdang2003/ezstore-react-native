import axios from '@/src/services/instance_axios';
import { PaginatedResponse, Response } from '@/src/types/response.type';
import { CheckoutRes, OrderHistory, OrderPreviewReq, OrderPreviewRes } from '../types/order.type';

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
