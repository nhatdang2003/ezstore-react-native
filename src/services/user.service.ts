import axios from '@/src/services/instance_axios'

export const getUserInfo = () => {
    const url = `api/v1/mobile/users/profiles`
    return axios.get(url)
}

export const updateUserInfo = (userInfo: any) => {
    const url = `/api/v1/mobile/users/profiles`
    return axios.put(url, userInfo)
}

export const sendOTP = (email: string) => {
    const url = `api/v1/mobile/users/profiles/send-otp`
    return axios.get(url, { params: { email } })
}








