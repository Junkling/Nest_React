import { DataSource } from 'typeorm';
import { User } from '../module/users/user.entity';
import { config } from 'dotenv';
import {Boards} from "../module/boards/boards.entity";
import {Languages} from "../module/languages/languages.entity";
import {NativeLanguages} from "../module/languages/native-languages.entity";
import {WishLanguages} from "../module/languages/wish-languages.entity";
import {Invite} from "../module/invites/invites.entity";

// .env 파일의 내용을 환경 변수로 로드
config();

// 필수 환경 변수를 체크하는 함수
function getEnvVariable(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing DB environment variable: ${name}`);
    }
    return value;
}

// DataSource 설정
export const DbDatasource = new DataSource({
    type: getEnvVariable('DB_CONNECTION') as 'postgres',
    host: getEnvVariable('DB_HOST'),
    port: parseInt(getEnvVariable('DB_PORT'), 10),  // 환경 변수를 파싱하여 포트 번호로 사용
    username: getEnvVariable('DB_USERNAME'),
    password: getEnvVariable('DB_PASSWORD'),
    database: getEnvVariable('DB_DATABASE'),
    entities: [User, Boards, Languages, NativeLanguages, WishLanguages, Invite],  // 엔티티를 명시적으로 지정하거나, glob 패턴을 사용하여 여러 엔티티를 포함 가능
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
});
