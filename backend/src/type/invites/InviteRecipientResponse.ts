import {toUserResponse, UserResponse} from "../user/UserResponse";
import {InviteStatus} from "./InviteStatus";
import {Invite} from "../../module/invites/invites.entity";

export interface InviteRecipientResponse {
    id: number;
    sender: UserResponse;
    status: InviteStatus;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export function toInviteRecipientResponse(entity: Invite): InviteRecipientResponse {
    const id = entity.id;
    const sender = toUserResponse(entity.sender);
    const status = entity.status;
    const content = entity.content;
    const createdAt = entity.createdAt;
    const updatedAt = entity.updatedAt;
    const result = {id, sender, status, content, createdAt, updatedAt}
    return result;
}