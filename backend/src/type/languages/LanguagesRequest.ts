import { ApiProperty } from '@nestjs/swagger';

export class LanguagesRequest {
    @ApiProperty({ description: '언어 코드', example: 'en' })
    code!: string;

    @ApiProperty({ description: '언어 이름', example: 'English' })
    name!: string;
}
