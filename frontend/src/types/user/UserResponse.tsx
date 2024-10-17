import {Gender} from "./Gender";

export interface UserResponse {
    id: number; // 유저 ID
    name: string; // 유저 이름
    age: number; // 유저 나이
    introduce?: string; // 유저 자기소개 (선택적)
    gender: Gender; // 유저 성별
    matchOpenStatus: boolean; // 매칭 공개 상태
}