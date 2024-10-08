import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {User} from "./user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CustomJwtModule} from "../jwt/jwt.module";
import {AuthModule} from "../../auth/auth.module";
import {LanguagesModule} from "../languages/languages.module";
import {Languages} from "../languages/languages.entity";
import {NativeLanguages} from "../languages/native-languages.entity";
import {WishLanguages} from "../languages/wish-languages.entity";
import {UserChatRoom} from "../chat/user-chat-room.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([User,NativeLanguages, WishLanguages, Languages, UserChatRoom])
        , CustomJwtModule
        , AuthModule
        , LanguagesModule
    ],  // UserRepository를 제공하는 TypeORM 모듈 등록
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],  // 필요한 경우 다른 모듈에서 사용할 수 있도록 UsersService를 내보내기
})
export class UsersModule {
}
