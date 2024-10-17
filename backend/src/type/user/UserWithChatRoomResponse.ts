import {ApiProperty} from "@nestjs/swagger";
import {UserResponse} from "./UserResponse";
import {ChatRoomResponse} from "../chat/ChatRoomResponse";

export class UserWithChatRoomResponse {
    @ApiProperty({description: '유저 응답값'})
    user!: UserResponse;

    @ApiProperty({description: '유저 채팅방 리스트'})
    chatRoomList!: ChatRoomResponse[];

    constructor(user: UserResponse, chatRoomList: ChatRoomResponse[]) {
        this.user = user;
        this.chatRoomList = chatRoomList;
    }
}