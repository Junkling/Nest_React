import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/user.entity";
import {Invite} from "./invites.entity";
import {InviteService} from "./Invite.service";
import {InviteController} from "./Invite.controller";
import {NativeLanguages} from "../languages/native-languages.entity";
import {WishLanguages} from "../languages/wish-languages.entity";
import {Languages} from "../languages/languages.entity";
import {JwtModule} from "@nestjs/jwt";
import {AuthModule} from "../../auth/auth.module";
import {CustomJwtModule} from "../jwt/jwt.module";
import {ChatService} from "../chat/chat.service";
import {ChatModule} from "../chat/chat.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Invite, User, NativeLanguages, WishLanguages, Languages])
        , AuthModule
        , ChatModule
    ],
    providers: [InviteService],
    controllers: [InviteController],
    exports: [InviteService]
})
export class InviteModule {
}