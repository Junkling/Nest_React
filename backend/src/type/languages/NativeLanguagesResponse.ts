import {LanguagesResponse, toLanguagesResponse} from "./LanguagesResponse";
import {WishLanguages} from "../../module/languages/wish-languages.entity";
import {UserResponse} from "../user/UserResponse";
import {NativeLanguages} from "../../module/languages/native-languages.entity";

export interface NativeLanguagesResponse {
    id: number;
    nativeLanguage: LanguagesResponse;
}

export function toNativeLanguagesResponse(nativeLanguages: NativeLanguages): NativeLanguagesResponse {
    const id = nativeLanguages.id;
    const nativeLanguage = toLanguagesResponse(nativeLanguages.language);
    return {id,  nativeLanguage}
}