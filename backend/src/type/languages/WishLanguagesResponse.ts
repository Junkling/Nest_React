import {LanguagesResponse, toLanguagesResponse} from "./LanguagesResponse";
import {WishLanguages} from "../../module/languages/wish-languages.entity";
import {UserResponse} from "../user/UserResponse";

export interface WishLanguagesResponse {
    id: number;
    wishLanguage: LanguagesResponse;
}

export function toWishLanguagesResponse(wishLanguages: WishLanguages): WishLanguagesResponse {
    const id = wishLanguages.id;
    const wishLanguage = toLanguagesResponse(wishLanguages.language);
    return {id,  wishLanguage}
}