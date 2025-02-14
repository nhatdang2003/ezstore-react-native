import { CategoryResponse } from '@/src/types/category.type'
import axios from '@/src/services/instance_axios'

export const getCategoriesHomeTab = (): Promise<CategoryResponse> => {
    const url = 'api/v1/categories?size=10'
    return axios.get(url)
}