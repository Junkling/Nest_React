import {toUserResponse, UserResponse} from "../user/UserResponse";
import {InviteStatus} from "./InviteStatus";
import {Invite} from "../../module/invites/invites.entity";

export interface InviteResponse {
    id: number;
    sender: UserResponse;
    recipient: UserResponse;
    status: InviteStatus;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export function toInviteResponse(entity: Invite): InviteResponse {
    const id = entity.id;
    const sender = toUserResponse(entity.sender);
    const recipient = toUserResponse(entity.recipient);
    const status = entity.status;
    const content = entity.content;
    const createdAt = entity.createdAt;
    const updatedAt = entity.updatedAt;
    const result = {id, sender, recipient, status, content, createdAt, updatedAt}
    return result;
}