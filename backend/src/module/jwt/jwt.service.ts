import {Injectable} from '@nestjs/common';
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtUtilsService {
    generateJwt(id: number, name: string): string {
        const secretKey = process.env.JWT_SECRET || 'default_secret';
        const token = jwt.sign(
            { id, name },
            secretKey,
            { expiresIn: '1h' }
        );
        return token;
    }
}
