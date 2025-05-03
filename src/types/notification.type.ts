export interface Notification {
    id: number;
    title: string;
    content: string;
    type: 'ORDER_STATUS_UPDATED'
    | 'PROMOTION_NOTIFICATION'
    | 'PROMOTION_NOTIFICATION';
    read: boolean;
    notificationDate: string;
    referenceIds: string;
    startPromotionDate: string;
    endPromotionDate: string;
}

export interface NotificationsResponse {
    notifications: Notification[];
    unreadCount: number;
}
