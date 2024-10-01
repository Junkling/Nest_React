import {User} from "../../module/users/user.entity";
import {NotFoundException} from "@nestjs/common";
import {Gender} from "./Gender";

export interface UserResponse {
    id: number;
    name: string;
    age: number;
    introduce?: string;
    gender: Gender;
    matchOpenStatus: boolean;
}

export function toUserResponse(user: User): UserResponse {
    if (!user) throw new NotFoundException();
    const id = user.id;
    const name = user.getName();
    const age = user.getAge();
    const matchOpenStatus = user.matchOpenStatus;
    const introduce = user.getIntroduce();
    const gender = user.gender;
    const result = {id, name, age, introduce, gender, matchOpenStatus};
    return result;
}