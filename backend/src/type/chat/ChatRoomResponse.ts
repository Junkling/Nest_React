import { ApiProperty } from '@nestjs/swagger';
import {ChatRoom} from "../../module/chat/chat.room.entity";

export class ChatRoomResponse {
    @ApiProperty({ description: '채팅방 ID', example: 1 })
    roomId!: number;

    @ApiProperty({ description: '채팅방 이름', example: 'General Chat Room' })
    roomName!: string;
}
export function entityToChatRoomResponse(entity: ChatRoom): ChatRoomResponse {
    const roomId = entity.id;
    const roomName = entity.roomName;
    return {roomId, roomName};
}