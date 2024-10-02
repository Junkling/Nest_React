import {toUserResponse, UserResponse} from "../user/UserResponse";
import {InviteStatus} from "./InviteStatus";
import {Invite} from "../../module/invites/invites.entity";

export interface InviteSendResponse {
    id: number;
    recipient: UserResponse;
    status: InviteStatus;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export function toInviteSendResponse(entity: Invite): InviteSendResponse {
    const id = entity.id;
    const recipient = toUserResponse(entity.recipient);
    const status = entity.status;
    const content = entity.content;
    const createdAt = entity.createdAt;
    const updatedAt = entity.updatedAt;
    const result = {id, recipient, status, content, createdAt, updatedAt}
    return result;
}