import axios from '@/src/services/instance_axios';
import { Response } from '@/src/types/response.type';

export const validateVnpayPayment = (queryParams: string): Promise<Response<void>> => {
    const url = `/api/v1/payment/vnpay_return?${queryParams}`
    return axios.get(url)
}