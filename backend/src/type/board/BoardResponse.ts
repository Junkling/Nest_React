import {toUserResponse, UserResponse} from "../user/UserResponse";
import {Boards} from "../../module/boards/boards.entity";

export interface BoardResponse {
    id?: number;

    title: string;

    description: string;

    userResponse: Omit<UserResponse,'boardIdsList'> | null;
}

export function toBoardResponse(entity: Boards): BoardResponse {
    const id = entity.getId();
    const title = entity.getTitle();
    const description = entity.getDescription();
    const user = entity.getUser();
    let userResponse = null;
    if (user) {
        userResponse = toUserResponse(user);
    }
    return {id, title, description, userResponse}
}