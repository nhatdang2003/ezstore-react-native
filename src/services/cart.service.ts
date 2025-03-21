import axios from '@/src/services/instance_axios'
import { VariantCart } from '@/src/types/cart.type'
import { Response } from '@/src/types/response.type'

export const addToCart = (data: VariantCart): Promise<Response<void>> => {
    const url = `api/v1/carts/items`
    return axios.post(url, data)
}