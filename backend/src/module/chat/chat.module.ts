import {Module} from '@nestjs/common';
import {ChatGateway} from './chat.gateway';
import {ChatService} from './chat.service';
import {BoardsService} from "../boards/boards.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/user.entity";
import {ChatRoom} from "./chat.room.entity";
import {ChatMessage} from "./chat.message.entity";
import {RedisService} from "../redis/redis.service";
import {UserChatRoom} from "./user-chat-room.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ChatRoom, ChatMessage, User, UserChatRoom])],
    providers: [ChatGateway, ChatService, RedisService],
    exports: [ChatService]
})
export class ChatModule {
}
