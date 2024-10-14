import {toUserResponse, UserResponse} from "../user/UserResponse";
import {Boards} from "../../module/boards/boards.entity";
import {ApiProperty, OmitType} from "@nestjs/swagger";

export class BoardResponse {
    @ApiProperty({ description: '게시물 ID', example: 1, required: false })
    id?: number;

    @ApiProperty({ description: '게시물 제목', example: 'Exciting Announcement!' })
    title!: string;

    @ApiProperty({ description: '게시물 설명', example: 'This is a description of the announcement.' })
    description!: string;

    @ApiProperty({description: '유저 정보'})
    userResponse!: UserResponse | null;
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