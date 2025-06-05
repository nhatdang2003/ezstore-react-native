import axios from '@/src/services/instance_axios'

export const sendTokenToServerAPI = async (token: string) => {
    const url = `api/v1/notifications/save-fcm-token`;
    return axios.post(url, { deviceToken: token });
};

export const deleteTokenFromServerAPI = async (token: string) => {
    const url = `api/v1/notifications/delete-fcm-token`;
    return axios.delete(url, { data: { deviceToken: token } });
};
