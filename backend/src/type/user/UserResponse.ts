import {User} from "../../module/users/user.entity";
import {NotFoundException} from "@nestjs/common";
import {Gender} from "./Gender"; // Gender Enum import
import {ApiProperty} from '@nestjs/swagger';

export class UserResponse {
    @ApiProperty({ description: '유저 ID', example: 1 })
    id!: number;

    @ApiProperty({ description: '유저 이름', example: 'John Doe' })
    name!: string;

    @ApiProperty({ description: '유저 나이', example: 25 })
    age!: number;

    @ApiProperty({ description: '유저 자기 소개', required: false, example: 'I am a software developer.' })
    introduce?: string;

    @ApiProperty({ description: '성별', enum: Gender, example: Gender.MALE })
    gender!: Gender;

    @ApiProperty({ description: '매칭 공개 상태', example: true })
    matchOpenStatus!: boolean;
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