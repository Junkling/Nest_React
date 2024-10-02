import {InviteStatus} from "./InviteStatus";

export interface InviteStateUpdateRequest {
    inviteId: number,
    status: InviteStatus
}

export interface InviteContentUpdateRequest {
    inviteId: number,
    content: string
}