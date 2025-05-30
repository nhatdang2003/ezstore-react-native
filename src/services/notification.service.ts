import axios from '@/src/services/instance_axios';
import { PaginatedResponse, Response } from '@/src/types/response.type';
import { Notification } from '@/src/types/notification.type';

export const getUnreadNotificationCount = (): Promise<Response<number>> => {
    const url = `api/v1/notifications/unread-count`
    return axios.get(url);
}

export const getNotifications = (page: number = 0, pageSize: number = 10): Promise<PaginatedResponse<Notification>> => {
    const url = `api/v1/notifications?page=${page}&pageSize=${pageSize}`
    return axios.get(url)
}

export const markReadNotification = (id: number): Promise<Response<Notification>> => {
    const url = `/api/v1/notifications/mark-read/${id}`
    return axios.put(url, id);
}

export const markReadAllNotification = (): Promise<Response<void>> => {
    const url = `/api/v1/notifications/mark-read-all`
    return axios.post(url);
}