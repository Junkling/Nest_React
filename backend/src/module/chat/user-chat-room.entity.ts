import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../users/user.entity";
import {ChatRoom} from "./chat.room.entity";

@Entity('user_chat_room')
export class UserChatRoom {
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @ManyToOne(() => User, user => user.userChatRoom)
    user!: User;

    @ManyToOne(() => ChatRoom, chatRoom => chatRoom.userChatRooms)
    chatRoom!: ChatRoom;

    constructor(user: User, chatRoom: ChatRoom) {
        this.user = user;
        this.chatRoom = chatRoom;
    }
}