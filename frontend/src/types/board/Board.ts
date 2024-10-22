export interface Board {
    id?: number;

    title: string;

    description: string;

    userResponse: UserResponse | null;
}

interface UserResponse {
    id: number;
    name: string;
    age: number;
}