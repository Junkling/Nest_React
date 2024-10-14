import { ApiProperty } from '@nestjs/swagger';
import {Languages} from "../../module/languages/languages.entity";

export class LanguagesResponse {
    @ApiProperty({ description: '언어 ID', example: 1 })
    id!: number;

    @ApiProperty({ description: '언어 코드', example: 'en' })
    code!: string;

    @ApiProperty({ description: '언어 이름', example: 'English' })
    name!: string;
}

export function toLanguagesResponse(entity: Languages): LanguagesResponse {
    const id = entity.id;
    const code = entity.code;
    const name = entity.name;
    const response = {id, code, name};
    return response;
}