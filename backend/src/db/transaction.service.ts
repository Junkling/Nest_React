import {DataSource} from 'typeorm';
import {Injectable, InternalServerErrorException} from '@nestjs/common';

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
            throw new InternalServerErrorException('트랜잭션 중 오류 발생');
        } finally {
            await queryRunner.release();
        }
    }
}
