import { ApiProperty } from '@nestjs/swagger';

export class BoardRequest {
    @ApiProperty({ description: '게시물 제목', example: 'Exciting Announcement!' })
    title!: string;

    @ApiProperty({ description: '게시물 설명', example: 'This is the description of the announcement.' })
    description!: string;

    @ApiProperty({ description: '유저 ID', example: 123 })
    userId!: number;
}
