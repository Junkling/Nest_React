import { ApiProperty } from '@nestjs/swagger';

export class InviteRequest {
    @ApiProperty({ description: '파트너 ID', example: 456 })
    partnerId!: number;

    @ApiProperty({ description: '초대 내용', example: 'Please join my team!' })
    content!: string;
}
