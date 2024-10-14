import axios from 'axios';
import { User } from "../types/User";
import { Board } from "../types/Board";
import { PageResult } from "../types/PageResult";

// 토큰을 가져오는 함수 (AuthContext나 로컬 스토리지에서 토큰을 가져옵니다)
const getToken = (): string | null => {
    return localStorage.getItem('token'); // 로컬 스토리지에서 토큰을 가져옵니다
};

// Axios 인스턴스 생성 (토큰 자동 추가)
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_DOMAIN || 'http://localhost:4000',
});

// 요청 인터셉터 추가 (Authorization 헤더에 토큰 추가)
axiosInstance.interceptors.request.use((config) => {
    const token = getToken(); // 토큰 가져오기
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

class ApiService {
    // Users API
    async fetchUsers(): Promise<User[]> {
        const response = await axiosInstance.get<User[]>('/users');
        return response.data;
    }

    async addUser(name: string, age: number): Promise<User> {
        const response = await axiosInstance.post<User>('/users', { name, age });
        return response.data;
    }

    async fetchUserById(id: number): Promise<User> {
        const response = await axiosInstance.get<User>(`/users/${id}`);
        return response.data;
    }

    // Boards API
    async fetchBoards(page: number, size: number, field: string, sort: 'ASC' | 'DESC'): Promise<PageResult<Board>> {
        const response = await axiosInstance.get<PageResult<Board>>('/boards', {
            params: { page, size, field, sort },
        });
        return response.data;
    }

    async fetchBoardById(id: number): Promise<Board> {
        const response = await axiosInstance.get<Board>(`/boards/${id}`);
        return response.data;
    }
}

export const apiService = new ApiService();
