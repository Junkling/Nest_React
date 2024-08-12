import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "./users/users.module";
import {AppDataSource} from "./db/AppDataSource";

@Module({
  // ormconfig.json 설정을 자동으로 사용
  imports: [
      TypeOrmModule.forRoot(AppDataSource.options),  // DataSource의 옵션을 사용
    UsersModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
