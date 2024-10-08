import {LanguagesResponse, toLanguagesResponse} from "./LanguagesResponse";
import {WishLanguages} from "../../module/languages/wish-languages.entity";

export interface WishLanguagesResponse {
    id: number;
    wishLanguage: LanguagesResponse;
}

export function toWishLanguagesResponse(wishLanguages: WishLanguages): WishLanguagesResponse {
    const id = wishLanguages.id;
    const wishLanguage = toLanguagesResponse(wishLanguages.language);
    return {id,  wishLanguage}
}