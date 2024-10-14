import { ApiProperty } from '@nestjs/swagger';

export class PageRequest {
    @ApiProperty({ default: 1, description: '페이지 번호' })
    page: number = 1;

    @ApiProperty({ default: 5, description: '페이지 크기' })
    size: number = 5;

    @ApiProperty({ default: 'id', description: '정렬 기준 필드' })
    field: string = 'id';

    @ApiProperty({ default: 'DESC', enum: ['ASC', 'DESC'], description: '정렬 방식' })
    sort: 'ASC' | 'DESC' = 'DESC';
}

export function toFindOption({ page, size, field, sort}: PageRequest) {
    const skip = (page - 1) * size;
    const take = size;
    const order = field ? { [field]: sort } : {}; // 기본 정렬 방식은 ASC

    return { skip, take, order };
}