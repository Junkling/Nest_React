import { ApiProperty } from '@nestjs/swagger';
import { Gender } from './Gender'; // Gender Enum import

export class UserRequest {
        @ApiProperty({ description: '유저 이름', example: 'john_doe' })
        username!: string;

        @ApiProperty({ description: '비밀번호', example: 'securePassword123' })
        password!: string;

        @ApiProperty({ description: '실제 이름', example: 'John Doe' })
        name!: string;

        @ApiProperty({ description: '나이', example: 25 })
        age!: number;

        @ApiProperty({ description: '자기 소개', required: false, example: 'Hello, I love coding!' })
        introduce?: string;

        @ApiProperty({ description: '성별', enum: Gender, example: Gender.MALE })
        gender!: Gender;

        @ApiProperty({ description: '모국어 ID 리스트', type: [Number], example: [1, 2] })
        nativeLanguageIds!: number[];

        @ApiProperty({ description: '배우고 싶은 언어 ID 리스트', type: [Number], example: [3, 4] })
        wishLanguageIds!: number[];
}
