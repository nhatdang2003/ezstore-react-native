import axios from '@/src/services/instance_axios'
import { CartItem } from '@/src/types/cart.type'
import { Response } from '@/src/types/response.type';

export const getUserCart = (): Promise<Response<CartItem[]>> => {
    const url = `/api/v1/carts/items`;
    return axios.get(url);
}