import axios from '@/src/services/instance_axios'
import { ActiveCodeRequest, LoginRequest, RegisterRequest, VerifyActivationRequest } from '@/src/types/auth.type'

export const postLogin = (data: LoginRequest) => {
    const url = `api/v1/auth/login`
    return axios.post(url, data)
}

export const postRegister = (data: RegisterRequest) => {
    const url = `api/v1/auth/register`
    return axios.post(url, data)
}

export const getActiveCode = (data: ActiveCodeRequest) => {
    const url = `api/v1/auth/send-activation-code`
    return axios.get(url, { params: data })
}

export const verifyActivation = (data: VerifyActivationRequest) => {
    const url = `api/v1/auth/activate-code`
    return axios.post(url, data)
}
