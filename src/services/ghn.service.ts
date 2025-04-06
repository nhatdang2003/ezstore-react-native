import axios, { AxiosResponse } from 'axios';
import { Province, District, Ward } from '@/src/types/ghn.type';
import { Response } from '@/src/types/response.type';

// Create separate axios instance for GHN API
const ghnInstance = axios.create({
    baseURL: 'https://dev-online-gateway.ghn.vn',
    headers: {
        'Content-Type': 'application/json',
        'Token': process.env.EXPO_PUBLIC_GHN_TOKEN || '',
    }
});

// GHN API response format
interface GHNResponse<T> {
    code: number;
    message: string;
    data: T;
}

// Response interceptor to format responses consistently
ghnInstance.interceptors.response.use(function (response: AxiosResponse<GHNResponse<any>>) {
    // Transform GHN response format to match our app's Response format
    const result: Response<any> = {
        statusCode: response.data.code,
        error: response.data.code === 200 ? null : 'Error from GHN API',
        message: response.data.message || 'Success',
        data: response.data.code === 200 ? response.data.data : null
    };

    return result as unknown as AxiosResponse<any>;
}, function (error) {
    return Promise.reject(error);
});

export const getProvinces = (): Promise<Response<Province[]>> => {
    return ghnInstance.get('/shiip/public-api/master-data/province');
};

export const getDistricts = (provinceID: number): Promise<Response<District[]>> => {
    return ghnInstance.get('/shiip/public-api/master-data/district', {
        params: {
            province_id: provinceID
        }
    });
};

export const getWards = (districtID: number): Promise<Response<Ward[]>> => {
    return ghnInstance.get('/shiip/public-api/master-data/ward', {
        params: {
            district_id: districtID
        }
    });
};
