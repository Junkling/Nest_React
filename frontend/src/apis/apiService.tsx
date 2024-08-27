// src/services/apiService.ts

import axios from 'axios';
import { User } from "../types/User";
import { Board } from "../types/Board";
import {PageResult} from "../types/PageResult";

const API_DOMAIN = process.env.REACT_APP_API_DOMAIN || 'http://localhost:4000';  // 환경 변수에서 도메인 가져오기
const USER_API_URL = `${API_DOMAIN}/users`;
const BOARD_API_URL = `${API_DOMAIN}/boards`;

class ApiService {
    // Users API
    async fetchUsers(): Promise<User[]> {
        const response = await axios.get<User[]>(USER_API_URL);
        return response.data;
    }

    async addUser(name: string, age: number): Promise<User> {
        const response = await axios.post<User>(USER_API_URL, { name, age });
        return response.data;
    }

    async fetchUserById(id: number): Promise<User> {
        const response = await axios.get<User>(`${USER_API_URL}/${id}`);
        return response.data;
    }

    // Boards API
    async fetchBoards(page: number, size: number, field: string, sort: 'ASC' | 'DESC'): Promise<PageResult<Board>> {
        const response = await axios.get<PageResult<Board>>(BOARD_API_URL, {
            params: { page, size, field, sort },
        });
        return response.data;
    }

    async fetchBoardById(id: number): Promise<Board> {
        const response = await axios.get<Board>(`${BOARD_API_URL}/${id}`);
        return response.data;
    }
}

export const apiService = new ApiService();
