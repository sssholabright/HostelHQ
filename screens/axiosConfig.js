import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'http://192.168.89.91:8000/',
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            const response = await axios.post('http://192.168.89.91:8000/api/token/refresh/', {
                refresh: refreshToken,
            });
            const { access } = response.data;
            await AsyncStorage.setItem('access_token', access);
            api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            return api(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default api;
