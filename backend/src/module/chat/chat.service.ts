import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ChatRoom} from "./chat.room.entity";
import {ChatMessage} from "./chat.message.entity";
import {RedisService} from "../redis/redis.service";
import {UserChatRoom} from "./user-chat-room.entity";
import {User} from "../users/user.entity";
import {orElseThrow, Transaction} from "../../db/db.utils";
import {PageRequest, toFindOption} from "../../type/pagenation/PageRequest";
import {PageResult} from "../../type/pagenation/PageResult";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatRoom)
        private readonly chatRoomRepository: Repository<ChatRoom>,
        @InjectRepository(UserChatRoom)
        private readonly userChatRoomRepository: Repository<UserChatRoom>,
        @InjectRepository(ChatMessage)
        private readonly chatMessageRepository: Repository<ChatMessage>,
        private readonly redisService: RedisService,
    ) {
    }

    // 채팅방 생성 메서드
    @Transaction()
    async createChatRoom(roomName: string, sender: User, receipt: User): Promise<void> {
        console.log(`채팅방 '${roomName}' 생성`);
        // 채팅방 만들고 채팅방 유저와 엮고
        const chatRoom = await this.chatRoomRepository.save(new ChatRoom(roomName));
        await this.userChatRoomRepository.save(new UserChatRoom(sender, chatRoom));
        await this.userChatRoomRepository.save(new UserChatRoom(receipt, chatRoom));

        await this.redisService.subscribeToRoom(roomName, (message) => {
            console.log(`채팅방 ${roomName}에서 수신된 메시지: ${message}`);
        });
    }

    // ChatService에서 sendMessage 메서드
    async sendMessage(roomName: string, chatMessage: ChatMessage): Promise<void> {
        console.log(`메시지 발송: ${chatMessage.message}`);
        await this.redisService.publishMessage(roomName, chatMessage.message);
    }


    async saveMessage(roomId: number, sender: string, message: string): Promise<ChatMessage> {
        const room = orElseThrow(await this.chatRoomRepository.findOne({where: {id: roomId}})
            , () => new NotFoundException('채팅방을 찾을 수 없습니다.'));

        const chatMessage = this.chatMessageRepository.create({sender, message, room});
        return this.chatMessageRepository.save(chatMessage);
    }

    async getMessagesByRoomId(roomId: number, pageReq: PageRequest): Promise<PageResult<ChatMessage>> {
        const [chats, count] = await this.chatMessageRepository.findAndCount({
            where: {room: {id: roomId}}
            , ...toFindOption(pageReq)
        });
        return new PageResult<ChatMessage>(chats, count, pageReq.page, chats.length);
    }

    async updateMessage(id: number, newMessage: string, userId: number): Promise<ChatMessage> {
        const message = orElseThrow(await this.chatMessageRepository.findOne({where: {id}}), () => new NotFoundException('메시지를 찾을 수 없습니다.'));

        // 여기에서 권한 체크 로직 추가 (예: 작성자 확인)
        message.message = newMessage;
        message.updatedBy = userId;
        await this.chatMessageRepository.save(message);
        return message;
    }
}
