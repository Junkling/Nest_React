import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {User} from "./user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CustomJwtModule} from "../../jwt/jwt.module";
import {AuthModule} from "../../auth/auth.module";


@Module({
  imports: [
      TypeOrmModule.forFeature([User])
      ,CustomJwtModule
      ,AuthModule
  ],  // UserRepository를 제공하는 TypeORM 모듈 등록
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],  // 필요한 경우 다른 모듈에서 사용할 수 있도록 UsersService를 내보내기
})
export class UsersModule {}
