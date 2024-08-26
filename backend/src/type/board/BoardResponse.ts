import {toUserResponse, UserResponse} from "../user/UserResponse";
import {PageRequest} from "../pagenation/PageRequest";
import {Boards} from "../../module/boards/boards.entity";

export interface BoardResponse {
    id?: number;

    title: string;

    description: string;

    userResponse: UserResponse | null;
}

export function toBoardResponse(entity: Boards): BoardResponse {
    const id = entity.getId();
    const title = entity.getTitle();
    const description = entity.getDescription();
    const user = entity.getUser();
    const userResponse = toUserResponse(user);
    return {id, title, description, userResponse}
}