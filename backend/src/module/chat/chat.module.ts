import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import {BoardsService} from "../boards/boards.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Boards} from "../boards/boards.entity";
import {User} from "../users/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Boards, User])],
    providers: [ChatGateway, ChatService, BoardsService],
})
export class ChatModule {}
