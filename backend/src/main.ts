import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import cors from 'cors';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());

  const config = new DocumentBuilder()
      .setTitle('API 문서') // 문서의 제목 설정
      .setDescription('API 설명') // 문서에 대한 설명
      .setVersion('1.0') // 버전 정보
      .addTag('users') // 태그 설정 (선택 사항)
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header'
      }) // JWT Bearer 설정
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document); // '/api' 경로에 Swagger UI 설정

  await app.listen(4000);
}
bootstrap();
