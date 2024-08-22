import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Boards} from "./boards.entity";
import {BoardsService} from "./boards.service";
import {BoardsController} from "./boards.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Boards])],
    providers: [BoardsService],
    controllers: [BoardsController],
    exports: [BoardsService],
})
export class BoardsModule {}