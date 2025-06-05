import axios from "@/src/services/instance_axios"
import { ShippingProfile, ShippingProfileDefaultReq, ShippingProfileReq } from "@/src/types/shipping-profile.type"
import { Response } from "@/src/types/response.type"

export const getShippingProfiles = (): Promise<Response<ShippingProfile[]>> => {
    const url = `/api/v1/shipping-profiles`
    return axios.get(url)
}

export const createShippingProfile = (data: ShippingProfileReq): Promise<Response<ShippingProfile>> => {
    const url = `/api/v1/shipping-profiles`
    return axios.post(url, data)
}

export const updateShippingProfile = (data: ShippingProfileReq): Promise<Response<ShippingProfile>> => {
    const url = `/api/v1/shipping-profiles`
    return axios.put(url, data)
}

export const setDefaultShippingProfile = (data: ShippingProfileDefaultReq): Promise<Response<ShippingProfile>> => {
    const url = `/api/v1/shipping-profiles/default`
    return axios.post(url, data)
}

export const getShippingProfileById = (id: number): Promise<Response<ShippingProfile>> => {
    const url = `/api/v1/shipping-profiles/${id}`
    return axios.get(url)
}

export const deleteShippingProfile = (id: number): Promise<Response<void>> => {
    const url = `/api/v1/shipping-profiles/${id}`
    return axios.delete(url)
}
