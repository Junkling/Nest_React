import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {BoardsService} from "../boards/boards.service";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    constructor(private readonly boardsService: BoardsService) {}

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

    // 방에 참여하는 이벤트 처리
    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, payload: { room: string }) {
        client.join(payload.room); // 해당 방에 참여
        console.log(`${client.id} joined room: ${payload.room}`);
    }

    // 방 내에서 메시지 전송
    @SubscribeMessage('sendPrivateMessage')
    async handlePrivateMessage(client: Socket, payload: { sender: string; boardId: number; message: string }) {
        // 게시물의 작성자 가져오기
        const board = await this.boardsService.findOne(payload.boardId);
        const recipientUsername = board.userResponse?.name;

        const room = `${payload.sender}_${recipientUsername}`; // 방 이름 설정
        client.join(room);

        // 해당 방에 메시지 전송
        this.server.to(room).emit('receiveMessage', {
            sender: payload.sender,
            message: payload.message,
        });
    }
}
