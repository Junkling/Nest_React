import {LanguagesResponse, toLanguagesResponse} from "./LanguagesResponse";
import {WishLanguages} from "../../module/languages/wish-languages.entity";
import { ApiProperty } from '@nestjs/swagger';

export class WishLanguagesResponse {
    @ApiProperty({ description: '희망 언어 ID', example: 1 })
    id!: number;

    @ApiProperty({ description: '희망 언어 정보', type: LanguagesResponse })
    wishLanguage!: LanguagesResponse;
}
export function toWishLanguagesResponse(wishLanguages: WishLanguages): WishLanguagesResponse {
    const id = wishLanguages.id;
    const wishLanguage = toLanguagesResponse(wishLanguages.language);
    return {id,  wishLanguage}
}