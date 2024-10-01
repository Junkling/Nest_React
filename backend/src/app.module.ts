import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {DbDatasource} from "./db/db.datasource";

function loadModules(): any[] {
    const modulesDir = path.join(__dirname, './module'); // 모듈 디렉토리 경로
    const modules: any[] = [];

    // 디렉토리 내의 파일을 읽고 모듈로 처리
    fs.readdirSync(modulesDir).forEach((file) => {
        const modulePath = path.join(modulesDir, file);

        if (fs.statSync(modulePath).isDirectory()) {
            const moduleFile = fs.readdirSync(modulePath).find((f) => f.endsWith('.module.ts'));

            if (moduleFile) {
                const importedModule = require(path.join(modulePath, moduleFile));
                // 모듈을 push
                modules.push(importedModule[Object.keys(importedModule)[0]]);
            }
        }
    });

    return modules;
}

@Module({
    imports: [
        TypeOrmModule.forRoot(DbDatasource.options),
        ...loadModules(), // 동적으로 로드한 모듈을 등록
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
