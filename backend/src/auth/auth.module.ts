// auth.module.ts
import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {JwtStrategy} from "../jwt/strategy";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),  // 'jwt' 전략을 기본 전략으로 설정
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'default_secret',
            signOptions: { expiresIn: process.env.JWT_EXPIRE || '1h' },
        }),
    ],
    providers: [JwtStrategy],  // JwtStrategy를 providers에 등록
    exports: [PassportModule],  // PassportModule을 내보냄
})
export class AuthModule {}
