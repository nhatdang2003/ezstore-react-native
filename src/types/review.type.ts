export interface OrderReviewResponse {
    lineItemId: number;
    productName: string;
    color: string;
    size: string;
    variantImage: string;
    firstName: string;
    lastName: string;
    avatar: string;
    createdAt: string;
    rating: number;
    description: string;
    imageUrls: string[];
    videoUrl: string;
}


export interface OrderReviewRequest {
    orderId: number;
    reviewItem: {
        lineItemId: number;
        rating: number;
        description: string;
        imageUrls: string[];
        videoUrl: string;
    };
}

export interface ReviewUploadSignUrlReq {
    fileNames: string[];
}

export interface ReviewUploadSignUrlRes {
    signedUrls: {
        fileName: string;
        signedUrl: string;
    }[];
}