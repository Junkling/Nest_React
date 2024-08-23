import {UserResponse} from "../user/UserResponse";

export interface BoardResponse {
    id?: number;

    title: string;

    description: string;

    user: UserResponse | null;
}