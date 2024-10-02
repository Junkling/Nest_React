import {TransactionalService} from "./transaction.service";
import {DbDatasource} from "./db.datasource";

export function orElseThrow<T>(value: T | null | undefined, error: () => Error): T {
    if (value === null || value === undefined) {
        throw error();
    }
    return value;
}

export function Transaction() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const transactionalService = new TransactionalService(DbDatasource);  // 여기에 DbDatasource를 주입
            return transactionalService.withTransaction(async (queryRunner) => {
                const result = await originalMethod.apply(this, [...args, queryRunner]);
                return result;
            });
        };

        return descriptor;
    };
}

