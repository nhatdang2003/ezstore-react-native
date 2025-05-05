import axios from '@/src/services/instance_axios'
import { ReturnRequestReq, ReturnRequestRes, SignedUrlRes } from "@/src/types/return-request.type"
import { Response } from "@/src/types/response.type"

export const createReturnRequest = (data: ReturnRequestReq): Promise<Response<ReturnRequestRes>> => {
    const url = `/api/v1/return-requests/user`;
    return axios.post(url, data);
}

export const getReturnRequestById = (id: number): Promise<Response<ReturnRequestRes>> => {
    const url = `/api/v1/return-requests/${id}`;
    return axios.get(url);
}

export const getReturnRequestByOrderId = (id: number): Promise<Response<ReturnRequestRes>> => {
    const url = `/api/v1/return-requests/orders/${id}`;
    return axios.get(url);
}

export const uploadReturnRequestImage = (data: { fileName: string }): Promise<Response<SignedUrlRes>> => {
    const url = `/api/v1/return-requests/upload-images`;
    return axios.post(url, data);
}

export const deleteReturnRequest = (id: number): Promise<Response<void>> => {
    const url = `/api/v1/return-requests/${id}`;
    return axios.delete(url);
}
