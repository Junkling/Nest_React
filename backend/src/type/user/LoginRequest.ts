import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
    @ApiProperty({ description: '유저 이름', example: 'test1@test.com' })
    username!: string;

    @ApiProperty({ description: '비밀번호' ,example: '1234' })
    password!: string;
}
