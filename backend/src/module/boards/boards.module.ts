import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Boards} from "./boards.entity";
import {BoardsService} from "./boards.service";
import {BoardsController} from "./boards.controller";
import {User} from "../users/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Boards, User])],
    providers: [BoardsService],
    controllers: [BoardsController],
    exports: [BoardsService],
})
export class BoardsModule {}