export interface UserRequest {
        username: string;
        password: string;
        name:string;
        age:number;
        introduce?:string;
        nativeLanguageIds:number[];
        wishLanguageIds:number[];
}