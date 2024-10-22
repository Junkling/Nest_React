import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {BaseTimeEntity} from "../common/base.time.entity";
import {ChatRoom} from "./chat.room.entity";

@Entity('chat_messages')
export class ChatMessage extends BaseTimeEntity {
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @Column()
    sender: string;

    @Column()
    message: string;

    @ManyToOne(() => ChatRoom, (room) => room.messages)
    room!: ChatRoom;

    constructor(sender: string, message: string) {
        super();
        this.sender = sender;
        this.message = message;
    }
}
