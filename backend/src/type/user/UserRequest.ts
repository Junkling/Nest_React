import {Gender} from "./Gender";

export interface UserRequest {
        username: string;
        password: string;
        name:string;
        age:number;
        introduce?:string;
        gender:Gender;
        nativeLanguageIds:number[];
        wishLanguageIds:number[];
}