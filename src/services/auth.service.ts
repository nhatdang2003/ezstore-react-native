import axios from '@/src/services/instance_axios'
import { LoginRequest, RegisterRequest } from '@/src/types/auth.type'

export const postLogin = (data: LoginRequest) => {
    const url = `api/v1/auth/login`
    return axios.post(url, data)
}

export const postRegister = (data: RegisterRequest) => {
    const url = `api/v1/auth/register`
    return axios.post(url, data)
}

