import {ChatRoom} from "../../module/chat/chat.room.entity";

export interface UserChatRoomResponse {
    roomId: number;
    roomName: string;
}

export function entityToUserChatRoomResponse(entity: ChatRoom): UserChatRoomResponse {
    const roomId = entity.id;
    const roomName = entity.roomName;
    return {roomId, roomName};
}