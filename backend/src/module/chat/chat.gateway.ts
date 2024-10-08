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
    ) {
    }

    async handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    async handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    // 사용자가 방에 참여할 때 처리하는 로직
    @SubscribeMessage('joinRoom')
    async handleJoinRoom(client: Socket, roomName: string) {
        try {
            // 클라이언트를 Socket.io 방에 참여시킴
            client.join(roomName);
            console.log(`Client ${client.id} joined room: ${roomName}`);

            // Redis Pub/Sub을 통해 방의 기존 메시지를 수신하고 실시간 동기화
            await this.redisService.subscribeToRoom(roomName, (message) => {
                if (message) {
                    this.server.to(roomName).emit('receiveMessage', message);
                } else {
                    console.error(`Failed to receive message for room: ${roomName}`);
                }
            });

            console.log(`Client ${client.id} successfully subscribed to room: ${roomName}`);
        } catch (err) {
            console.error(`Error subscribing client ${client.id} to room: ${roomName}`, err);
            client.leave(roomName); // 문제가 있을 경우 클라이언트가 방을 떠나도록 처리
        }
    }


    // 사용자가 메시지를 보낼 때 처리하는 로직
    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, payload: { roomName: string; sender: string; message: string }) {
        // 채팅 메시지를 DB에 저장
        const savedMessage = await this.chatService.saveMessage(payload.roomName, payload.sender, payload.message);

        // Redis Pub/Sub을 통해 해당 방에 메시지 발송
        await this.redisService.publishMessage(payload.roomName, savedMessage.message);

        // 방에 있는 모든 클라이언트에게 메시지 전송
        this.server.to(payload.roomName).emit('receiveMessage', savedMessage);
    }
}
