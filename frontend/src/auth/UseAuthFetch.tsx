import axios from 'axios';
import { useAuth } from './AuthContext';

const useAxios = () => {
    const { token } = useAuth(); // AuthContext에서 토큰 가져오기

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:4000', // 기본 API URL 설정
    });

    // 요청 인터셉터 추가 (Authorization 헤더 추가)
    axiosInstance.interceptors.request.use((config) => {
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    return axiosInstance;
};

export default useAxios;
