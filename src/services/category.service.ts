import axios from '@/src/services/instance_axios'
import { PaginatedResponse } from '@/src/types/response.type'
import { Category } from '@/src/types/category.type'

export const getCategoriesHomeTab = (): Promise<PaginatedResponse<Category>> => {
    const url = 'api/v1/categories?size=10'
    return axios.get(url)
}