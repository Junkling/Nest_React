import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionalService {
    constructor(private readonly dataSource: DataSource) {}

    async withTransaction(executeFn: (queryRunner: any) => Promise<any>): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await executeFn(queryRunner);
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            // 원래의 예외를 다시 던짐으로써 메시지를 보존
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
