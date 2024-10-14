import {toUserResponse, UserResponse} from "./UserResponse";
import {NativeLanguagesResponse, toNativeLanguagesResponse} from "../languages/NativeLanguagesResponse";
import {toWishLanguagesResponse, WishLanguagesResponse} from "../languages/WishLanguagesResponse";
import {User} from "../../module/users/user.entity";
import {ApiProperty} from "@nestjs/swagger";

export class UserLanguageResponse {
    @ApiProperty({description: '유저 응답 객체'})
    user!: UserResponse;
    @ApiProperty({ description: '모국어 리스트 객체'})
    nativeLanguages!: NativeLanguagesResponse[];
    @ApiProperty({ description: '학습 위시 언어 리스트 객체'})
    wishLanguages!: WishLanguagesResponse[];
}

export function toUserLanguageResponse(
    user: UserResponse,
    nativeLanguages: NativeLanguagesResponse[],
    wishLanguages: WishLanguagesResponse[]) {
    return {user, nativeLanguages, wishLanguages};
}
//
// export function entityToUserLanguageResponse(entity: User) {
//     const user = toUserResponse(entity);
//     const nativeLanguages = entity.nativeLanguages.map(toNativeLanguagesResponse);
//     const wishLanguages = entity.wishLanguages.map(toWishLanguagesResponse);
//     return {user, nativeLanguages, wishLanguages};
// }
export function entityToUserLanguageResponse(entity: User) {
    const user = toUserResponse(entity);

    // nativeLanguages와 wishLanguages가 존재하는지 확인 후 매핑
    const nativeLanguages = entity.nativeLanguages ? entity.nativeLanguages.map(toNativeLanguagesResponse) : [];
    const wishLanguages = entity.wishLanguages ? entity.wishLanguages.map(toWishLanguagesResponse) : [];

    return { user, nativeLanguages, wishLanguages };
}