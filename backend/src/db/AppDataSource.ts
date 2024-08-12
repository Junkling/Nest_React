import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import {config} from 'dotenv';

// .env 파일의 내용을 환경 변수로 로드
config();

// DataSource 설정
export const AppDataSource = new DataSource({
    type: process.env.DB_CONNECTION as 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),  // 환경 변수를 파싱하여 포트 번호로 사용
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User],  // 엔티티를 명시적으로 지정하거나, glob 패턴을 사용하여 여러 엔티티를 포함 가능
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
});
