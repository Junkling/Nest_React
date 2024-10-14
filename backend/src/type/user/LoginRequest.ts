import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
    @ApiProperty({ description: '유저 이름' })
    username!: string;

    @ApiProperty({ description: '비밀번호' })
    password!: string;
}
