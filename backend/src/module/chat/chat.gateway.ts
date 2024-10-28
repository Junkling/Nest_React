import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Inject } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { PageRequest } from '../../type/pagenation/PageRequest';
import * as jwt from 'jsonwebtoken'; // JWT 라이브러리 사용

@WebSocketGateway({
    cors: {
        origin: '*', // CORS 설정
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    constructor(
        private readonly chatService: ChatService, // 채팅 메시지 저장 서비스
        @Inject(RedisService) private readonly redisService: RedisService // Redis 서비스
    ) {}

    async handleConnection(client: Socket) {
        const token = client.handshake.query.token as string; // 쿼리 파라미터로 받은 토큰
        try {
            const decoded = jwt.verify(token, 'YOUR_SECRET_KEY'); // 토큰 검증
            client.data.user = decoded; // 사용자 정보 저장
            console.log(`Client connected: ${client.id}`);
        } catch (error) {
            console.error('Authentication failed:', error);
            client.disconnect(); // 인증 실패 시 연결 해제
        }
    }

    async handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    // 사용자가 방에 참여할 때 처리하는 로직 (roomId 사용)
    @SubscribeMessage('joinRoom')
    async handleJoinRoom(client: Socket, roomId: string) {
        try {
            client.join(roomId);
            console.log(`Client ${client.id} joined room: ${roomId}`);

            // Redis Pub/Sub을 통해 방의 기존 메시지를 수신하고 실시간 동기화
            await this.redisService.subscribeToRoom(roomId, (message) => {
                if (message) {
                    const parsedMessage = JSON.parse(message);
                    this.server.to(roomId).emit('receiveMessage', parsedMessage);
                } else {
                    console.error(`Failed to receive message for room: ${roomId}`);
                }
            });

            // 기존 메시지를 클라이언트로 전송
            const previousMessages = await this.chatService.getMessagesByRoomId(
                parseInt(roomId),
                new PageRequest(1, 10, 'createdAt', 'DESC')
            );

            if (previousMessages) {
                this.server.to(client.id).emit('loadedMessages', previousMessages);
            }

            console.log(`Client ${client.id} successfully subscribed to room: ${roomId}`);
        } catch (err) {
            console.error(`Error subscribing client ${client.id} to room: ${roomId}`, err);
            client.leave(roomId); // 문제가 있을 경우 클라이언트가 방을 떠나도록 처리
        }
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, payload: { roomId: string; message: string }, callback: Function) {
        try {
            const user = client.data.user;
            if (!user) throw new Error('Unauthorized');

            // 토큰에서 가져온 사용자 이름 사용
            const savedMessage = await this.chatService.saveMessage(parseInt(payload.roomId), user.username, payload.message);

            // Redis를 통해 메시지 발행 (저장된 전체 메시지 객체를 발행)
            await this.redisService.publishMessage(payload.roomId, JSON.stringify(savedMessage));

            // 방에 있는 모든 클라이언트에게 전체 메시지 객체 전송
            this.server.to(payload.roomId).emit('receiveMessage', savedMessage);

            callback(savedMessage); // 클라이언트에 전송된 메시지 확인 응답
        } catch (error) {
            console.error(`Error sending message for room: ${payload.roomId}`, error);
            callback({ error: 'Failed to send message' });
        }
    }

    @SubscribeMessage('editMessage')
    async handleEditMessage(client: Socket, payload: { id: number; message: string }, callback: Function) {
        try {
            const user = client.data.user;
            if (!user) throw new Error('Unauthorized');

            // 메시지 수정 로직 (사용자 권한 체크 포함)
            const updatedMessage = await this.chatService.updateMessage(payload.id, payload.message, user.id);

            // 모든 클라이언트에 업데이트된 메시지 전송
            this.server.to(updatedMessage.room.id.toString()).emit('messageUpdated', updatedMessage);

            callback(updatedMessage); // 수정된 메시지를 클라이언트로 응답
        } catch (error) {
            console.error(`Failed to edit message: ${error}`);
            callback({ error: 'Failed to edit message' });
        }
    }
}
