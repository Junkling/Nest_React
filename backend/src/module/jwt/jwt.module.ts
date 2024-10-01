import {Module} from '@nestjs/common';
import {JwtUtilsService} from './jwt.service';

@Module({
    providers: [JwtUtilsService],
    exports: [JwtUtilsService],  // 다른 모듈에서 사용할 수 있도록 exports
})
export class CustomJwtModule {}
