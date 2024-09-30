import {User} from "../../module/users/user.entity";

export interface BoardRequest {
    title: string;
    description: string;
    userId: number;
}
