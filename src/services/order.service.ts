import axios from '@/src/services/instance_axios';
import { Response } from '@/src/types/response.type';
import { CheckoutRes, OrderPreviewReq, OrderPreviewRes } from '../types/order.type';

export const getOrderPreview = (data: OrderPreviewReq): Promise<Response<OrderPreviewRes>> => {
    const url = `api/v1/orders/preview`
    return axios.post(url, data)
}

export const checkoutOrder = (data: OrderPreviewReq): Promise<Response<CheckoutRes>> => {
    const url = `api/v1/orders/check-out`
    return axios.post(url, data)
}
