export interface Notification {
    id: number;
    title: string;
    content: string;
    type: 'ORDER_STATUS_UPDATED'
    | 'PROMOTION_NOTIFICATION'
    | 'PROMOTION_NOTIFICATION';
    read: boolean;
    notificationDate: string;
    referenceId: number;
    imageUrl: string;
}

export interface NotificationsResponse {
    notifications: Notification[];
    unreadCount: number;
}
