import * as jwt from 'jsonwebtoken';

export function generateJwt(userId: number, name: string): string {
    const secretKey = process.env.JWT_SECRET || 'default_secret';
    const token = jwt.sign(
        { userId, name },
        secretKey,
        { expiresIn: '1h' }
    );
    return token;
}
