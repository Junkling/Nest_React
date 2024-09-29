import {Languages} from "../../module/languages/languages.entity";

export interface LanguagesResponse {
    id: number;
    code: string;
    name: string;
}

export function toLanguagesResponse(entity: Languages): LanguagesResponse {
    const id = entity.id;
    const code = entity.code;
    const name = entity.name;
    const response = {id, code, name};
    return response;
}