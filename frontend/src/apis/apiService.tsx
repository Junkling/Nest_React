import axios from 'axios';
import {User} from "../types/User";

const API_DOMAIN = process.env.REACT_API_DOMAIN || 'http://localhost:4000';  // 기본값을 설정하여 환경 변수가 없을 경우를 대비
const USER_API_URL = `${API_DOMAIN}/users`;

export const fetchUsers = async (): Promise<User[]> => {
    const response = await axios.get<User[]>(USER_API_URL);
    return response.data;
};

export const addUser = async (name: string, age: number): Promise<User> => {
    const response = await axios.post<User>(USER_API_URL, { name, age });
    return response.data;
};

export const fetchUserById = async (id: number): Promise<User> => {
    const response = await axios.get<User>(`${USER_API_URL}/${id}`);
    return response.data;
};
