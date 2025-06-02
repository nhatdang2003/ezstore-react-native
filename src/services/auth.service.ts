import axios from '@/src/services/instance_axios'
import { ActiveCodeRequest, LoginRequest, RecoverPasswordRequest, RegisterRequest, ResetPasswordRequest, VerifyActivationRequest, VerifyRecoverPasswordRequest } from '@/src/types/auth.type'

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

export const postVerifyActivation = (data: VerifyActivationRequest) => {
    const url = `api/v1/auth/activate-code`
    return axios.post(url, data)
}

export const postRecoverPassword = (data: RecoverPasswordRequest) => {
    const url = `api/v1/auth/recover-password-code`
    return axios.post(url, data)
}

export const postVerifyRecoverPassword = (data: VerifyRecoverPasswordRequest) => {
    const url = `api/v1/auth/verify-reset-code`
    return axios.post(url, data)
}

export const postResetPassword = (data: ResetPasswordRequest) => {
    const url = `api/v1/auth/reset-password-code`
    return axios.post(url, data)
}

export const postGoogleLogin = (data: string) => {
    const url = `api/v1/auth/google`
    return axios.post(url, { code: data })
}
