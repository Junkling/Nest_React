import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {ChatMessage} from "./chat.message.entity";
import {UserChatRoom} from "./user-chat-room.entity";

@Entity('chat_rooms')
export class ChatRoom {
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @Column()
    roomName: string;

    @OneToMany(type => UserChatRoom, userChatRoom => userChatRoom.chatRoom)
    userChatRooms!: UserChatRoom[];

    @OneToMany(() => ChatMessage, (message) => message.room)
    messages!: ChatMessage[];

    constructor(roomName: string) {
        this.roomName = roomName;
    }
}
