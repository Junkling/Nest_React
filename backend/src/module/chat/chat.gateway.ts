import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {ChatService} from './chat.service';
import {Inject} from '@nestjs/common';
import {RedisService} from "../redis/redis.service";
import {PageRequest} from "../../type/pagenation/PageRequest";

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
        console.log(`Client connected: ${client.id}`);
    }

    async handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    // 사용자가 방에 참여할 때 처리하는 로직 (roomId 사용)
    @SubscribeMessage('joinRoom')
    async handleJoinRoom(client: Socket, roomId: string) {
        try {
            // 클라이언트를 Socket.io 방에 참여시킴
            client.join(roomId);
            console.log(`Client ${client.id} joined room: ${roomId}`);

            // Redis Pub/Sub을 통해 방의 기존 메시지를 수신하고 실시간 동기화
            await this.redisService.subscribeToRoom(roomId, (message) => {
                if (message) {
                    this.server.to(roomId).emit('receiveMessage', message);
                } else {
                    console.error(`Failed to receive message for room: ${roomId}`);
                }
            });

            // 기존 메시지를 클라이언트로 전송
            const previousMessages = await this.chatService.getMessagesByRoomId(parseInt(roomId), new PageRequest(1, 10, 'createdAt', 'DESC'));
            if (previousMessages) {
                // 클라이언트로 기존 메시지 전송
                this.server.to(client.id).emit('loadedMessages', previousMessages);
            }

            console.log(`Client ${client.id} successfully subscribed to room: ${roomId}`);
        } catch (err) {
            console.error(`Error subscribing client ${client.id} to room: ${roomId}`, err);
            client.leave(roomId); // 문제가 있을 경우 클라이언트가 방을 떠나도록 처리
        }
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, payload: { roomId: string; sender: string; message: string }, callback: Function) {
        try {
            // 메시지 저장
            const savedMessage = await this.chatService.saveMessage(parseInt(payload.roomId), payload.sender, payload.message);

            // Redis를 통해 메시지 발행 (저장된 전체 메시지 객체를 발행)
            await this.redisService.publishMessage(payload.roomId, JSON.stringify(savedMessage));

            // 방에 있는 모든 클라이언트에게 전체 메시지 객체 전송
            this.server.to(payload.roomId).emit('receiveMessage', savedMessage);

            // 클라이언트에 전송된 메시지에 대해 응답을 보냄 (Optional: 보낸 클라이언트에 확인 응답)
            callback(savedMessage);
        } catch (error) {
            console.error(`Error sending message for room: ${payload.roomId}`, error);
            callback({ error: 'Failed to send message' });
        }
    }
}
