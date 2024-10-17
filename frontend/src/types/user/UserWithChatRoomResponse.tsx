// 유저 정보와 채팅방 리스트 응답 타입
import {ChatRoomResponse} from "../chat/ChatRoomResponse";
import {UserResponse} from "./UserResponse";

export interface UserWithChatRoomResponse {
    user: UserResponse; // 유저 정보
    chatRoomList: ChatRoomResponse[]; // 채팅방 리스트
}