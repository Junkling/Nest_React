import {LanguagesResponse, toLanguagesResponse} from "./LanguagesResponse";
import {NativeLanguages} from "../../module/languages/native-languages.entity";
import {ApiProperty} from "@nestjs/swagger";

export class NativeLanguagesResponse {
    @ApiProperty({ description: '모국어 ID', example: 1 })
    id!: number;

    @ApiProperty({ description: '모국어 정보', type: LanguagesResponse })
    nativeLanguage!: LanguagesResponse;
}


export function toNativeLanguagesResponse(nativeLanguages: NativeLanguages): NativeLanguagesResponse {
    const id = nativeLanguages.id;
    const nativeLanguage = toLanguagesResponse(nativeLanguages.language);
    return {id,  nativeLanguage}
}