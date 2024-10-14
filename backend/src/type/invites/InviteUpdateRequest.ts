import {InviteStatus} from "./InviteStatus";
import {ApiProperty} from "@nestjs/swagger";

export class InviteStateUpdateRequest {
    @ApiProperty({ description: '초대 ID', example: 123 })
    inviteId!: number;

    @ApiProperty({ description: '초대 상태', enum: InviteStatus, example: InviteStatus.ACCEPTED })
    status!: InviteStatus;
}

export class InviteContentUpdateRequest {
    @ApiProperty({ description: '초대 ID', example: 123 })
    inviteId!: number;

    @ApiProperty({ description: '초대 내용', example: 'This is the updated content.' })
    content!: string;
}