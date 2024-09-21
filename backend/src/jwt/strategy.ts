// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'default_secret',  // 환경변수 또는 기본 비밀키
        });
    }

    async validate(payload: any) {
        return { userId: payload.userId, name: payload.name };  // JWT의 payload를 반환 (userId와 name)
    }
}
