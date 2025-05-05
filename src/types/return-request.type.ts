export interface ReturnRequestReq {
    orderId: number;
    reason: string;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    imageUrls: string[];
}

export interface ReturnRequestRes {
    id: number;
    orderId: number;
    orderCode: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
    cashBackStatus: 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED';
    reason: string;
    createdAt: string;
    originalPaymentMethod: string;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    adminComment: string;
    imageUrls: string[];
    orderItems: {
        id: number;
        productName: string;
        color: string; // Assuming color can be any string
        size: string; // Assuming size can be any string
        variantImage: string;
        quantity: number;
        unitPrice: number;
        discount: number;
    }[];
}

export interface SignedUrlRes {
    signedUrl: string
}
