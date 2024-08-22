import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "./module/users/users.module";
import {AppDataSource} from "./db/AppDataSource";
import {BoardsModule} from "./module/boards/boards.module";

@Module({
  // ormconfig.json 설정을 자동으로 사용
  imports: [
      TypeOrmModule.forRoot(AppDataSource.options),  // DataSource의 옵션을 사용
    UsersModule,BoardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
