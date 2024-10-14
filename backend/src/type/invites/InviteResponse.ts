import {toUserResponse, UserResponse} from "../user/UserResponse";
import {InviteStatus} from "./InviteStatus";
import {Invite} from "../../module/invites/invites.entity";
import {ApiProperty} from "@nestjs/swagger";

export class InviteResponse {
    @ApiProperty({ description: '초대 ID', example: 123 })
    id!: number;

    @ApiProperty({ description: '발신자 정보', type: UserResponse })
    sender!: UserResponse;

    @ApiProperty({ description: '수신자 정보', type: UserResponse })
    recipient!: UserResponse;

    @ApiProperty({ description: '초대 상태', enum: InviteStatus, example: InviteStatus.OPEN })
    status!: InviteStatus;

    @ApiProperty({ description: '초대 내용', example: 'This is the invite content.' })
    content!: string;

    @ApiProperty({ description: '초대 생성 날짜', example: '2024-10-12T12:34:56.789Z' })
    createdAt!: Date;

    @ApiProperty({ description: '초대 수정 날짜', example: '2024-10-12T13:45:56.789Z' })
    updatedAt!: Date;
}

export function toInviteResponse(entity: Invite): InviteResponse {
    const id = entity.id;
    const sender = toUserResponse(entity.sender);
    const recipient = toUserResponse(entity.recipient);
    const status = entity.status;
    const content = entity.content;
    const createdAt = entity.createdAt;
    const updatedAt = entity.updatedAt;
    const result = {id, sender, recipient, status, content, createdAt, updatedAt}
    return result;
}