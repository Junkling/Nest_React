import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {ChatMessage} from "./chat.message.entity";

@Entity('chat_rooms')
export class ChatRoom {
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @Column()
    roomName: string;

    @OneToMany(() => ChatMessage, (message) => message.room)
    messages!: ChatMessage[];

    constructor(roomName: string) {
        this.roomName = roomName;
    }
}
