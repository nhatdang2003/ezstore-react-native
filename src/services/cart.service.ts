import axios from '@/src/services/instance_axios'
import { VariantCart } from '@/src/types/cart.type'
import { Response } from '@/src/types/response.type'
import { CartItem } from '@/src/types/cart.type'

export const addToCart = (data: VariantCart): Promise<Response<void>> => {
    const url = `api/v1/carts/items`
    return axios.post(url, data)
}

export const getUserCart = (): Promise<Response<CartItem[]>> => {
    const url = `/api/v1/carts/items`;
    return axios.get(url);
}

export const updateItemCart = (data: CartItem): Promise<Response<void>> => {
    const url = `api/v1/carts/items`
    return axios.put(url, data)
}

export const deleteItemCart = (cartItemId: number): Promise<Response<void>> => {
    const url = `api/v1/carts/items/${cartItemId}`
    return axios.delete(url);
}
