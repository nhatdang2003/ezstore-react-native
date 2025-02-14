interface Meta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface Category {
    id: number;
    name: string;
    imageUrl: string;
}

export interface CategoryResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: {
        meta: Meta;
        data: Category[];
    };
}