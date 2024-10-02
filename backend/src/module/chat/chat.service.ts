import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {ChatRoom} from "./chat.room.entity";
import {ChatMessage} from "./chat.message.entity";
import {RedisService} from "../redis/redis.service";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatRoom)
        private readonly chatRoomRepository: Repository<ChatRoom>,
        @InjectRepository(ChatMessage)
        private readonly chatMessageRepository: Repository<ChatMessage>,
        private readonly redisService: RedisService,
    ) {}
    // 채팅방 생성 메서드
    async createChatRoom(roomName: string): Promise<void> {
        console.log(`채팅방 '${roomName}' 생성`);
        // 구독만으로는 채팅방을 생성한 효과 (실제 방 생성은 없음)
        await this.redisService.subscribeToRoom(roomName, (message) => {
            console.log(`채팅방 ${roomName}에서 수신된 메시지: ${message}`);
        });
    }

    // ChatService에서 sendMessage 메서드
    async sendMessage(roomName: string, chatMessage: ChatMessage): Promise<void> {
        console.log(`메시지 발송: ${chatMessage.message}`);
        await this.redisService.publishMessage(roomName, chatMessage.message);
    }


    async saveMessage(roomName: string, sender: string, message: string): Promise<ChatMessage> {
        let room = await this.chatRoomRepository.findOne({ where: { roomName } });
        if (!room) {
            room = this.chatRoomRepository.create({ roomName });
            await this.chatRoomRepository.save(room);
        }

        const chatMessage = this.chatMessageRepository.create({ sender, message, room });
        return this.chatMessageRepository.save(chatMessage);
    }

    async getMessagesByRoom(roomName: string): Promise<ChatMessage[]> {
        const room = await this.chatRoomRepository.findOne({
            where: { roomName },
            relations: ['messages'],
        });
        return room ? room.messages : [];
    }
}
