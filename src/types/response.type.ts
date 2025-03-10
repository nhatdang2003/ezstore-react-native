export interface Meta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface PaginatedResponse<T> {
    statusCode: number;
    error: null | string;
    message: string;
    data: {
        meta: Meta;
        data: T[];
    };
}

export interface Response<T> {
    statusCode: number;
    error: null | string;
    message: string;
    data: T;
}
