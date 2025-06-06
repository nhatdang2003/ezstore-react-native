import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { refreshToken } from '@/src/services/auth.service';

const backend = Platform.OS === "android"
    ? process.env.EXPO_PUBLIC_ANDROID_API_URL
    : process.env.EXPO_PUBLIC_IOS_API_URL

const instance = axios.create({
    baseURL: backend,
})

// Store for pending requests
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

// Add a request interceptor
instance.interceptors.request.use(async function (config) {
    // Do something before request is sent
    const access_token = await AsyncStorage.getItem('access_token')
    if (access_token) {
        config.headers['Authorization'] = `Bearer ${access_token}`
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        if (response.data) return response.data
        return response;
    },
    async function (error) {
        const originalRequest = error.config;

        // If error response is not 401 or request already retried, reject
        if (!error.response || error.response.status !== 401 || originalRequest._retry) {
            if (error?.response?.data) return error?.response?.data
            return Promise.reject(error);
        }

        // If already refreshing, add request to queue
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(() => {
                    return instance(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        // Try to refresh token
        try {
            const refresh_token = await AsyncStorage.getItem('refresh_token');
            if (!refresh_token) {
                throw new Error('No refresh token available');
            }

            const response = await refreshToken(refresh_token);
            const { access_token, refresh_token: new_refresh_token } = response.data;

            // Store new tokens
            await AsyncStorage.setItem('access_token', access_token);
            await AsyncStorage.setItem('refresh_token', new_refresh_token);

            // Update authorization header
            instance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

            processQueue();
            return instance(originalRequest);
        } catch (err) {
            processQueue(err);
            // Clear tokens and redirect to login
            await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
            router.replace('/(auth)/login');
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);

export default instance