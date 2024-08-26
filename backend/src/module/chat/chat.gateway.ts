import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    // 사용자 입장 처리
    @SubscribeMessage('userJoined')
    handleUserJoined(client: Socket, username: string) {
        this.server.emit('receiveMessage', {
            sender: username,
            message: `${username}님이 입장하셨습니다.`,
            isJoinMessage: true,  // 입장 메시지 플래그
        });
    }

    // 일반 메시지 처리
    @SubscribeMessage('sendMessage')
    handleMessage(client: Socket, payload: { sender: string, message: string }) {
        this.server.emit('receiveMessage', { sender: payload.sender, message: payload.message });
    }
}
