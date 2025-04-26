import axios from '@/src/services/instance_axios';
import { Response } from '@/src/types/response.type';
import { NotificationsResponse } from '../types/notification.type';

export const getUnreadNotificationCount = (): Promise<Response<number>> => {
    const url = `api/v1/notifications/unread-count`
    return axios.get(url);
}

export const getNotifications = (): Promise<Response<NotificationsResponse>> => {
    const url = `api/v1/notifications`
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