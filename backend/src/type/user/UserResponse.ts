import {User} from "../../module/users/user.entity";
import {NotFoundException} from "@nestjs/common";

export interface UserResponse {
    name: string;
    age: number;
    introduce?: string;
    boardIdsList: (number|undefined)[];
}

export function toUserResponse(user: User): UserResponse{
    if(!user) throw new NotFoundException();
    const name = user.getName();
    const age = user.getAge();
    const introduce = user.getIntroduce()
    const boardIdsList= !user.boardList ? [] : user.getBoardList().map(board => {return board.getId()});
    const result = {name, age, introduce, boardIdsList};
    return result;
}