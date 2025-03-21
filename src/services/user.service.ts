import axios from '@/src/services/instance_axios'
import { Response } from '@/src/types/response.type';
import { UserInfo } from '@/src/types/user.type'


export const getUserInfo = () => {
    const url = `api/v1/mobile/users/profiles`
    return axios.get(url)
}

export const updateUserInfo = (data: any) => {
    const url = `/api/v1/mobile/users/profiles`
    return axios.put(url, data)
}

export const sendOTP = (email: string) => {
    const url = `api/v1/mobile/users/profiles/send-otp`
    return axios.get(url, { params: { email } })
}

export const updateAvatar = (data: any) => {
    const url = `api/v1/users/profiles/avatar`
    return axios.put(url, data)
}

export const getUserCartInfo = (): Promise<Response<UserInfo>> => {
    const url = `api/v1/users/info`
    return axios.get(url)
}


