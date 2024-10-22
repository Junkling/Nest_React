import { ApiProperty } from '@nestjs/swagger';
export class PageRequest {
    @ApiProperty({ default: 1, description: '페이지 번호' })
    page: number;

    @ApiProperty({ default: 5, description: '페이지 크기' })
    size: number;

    @ApiProperty({ default: 'id', description: '정렬 기준 필드' })
    field: string;

    @ApiProperty({ default: 'DESC', enum: ['ASC', 'DESC'], description: '정렬 방식' })
    sort: 'ASC' | 'DESC';

    // 기본 생성자 (모든 필드를 기본값으로 초기화)
    constructor();
    // 파라미터를 받아서 생성하는 경우
    constructor(page: number, size: number, field?: string, sort?: 'ASC' | 'DESC');
    constructor(
        page: number = 1,
        size: number = 5,
        field: string = 'id',
        sort: 'ASC' | 'DESC' = 'DESC'
    ) {
        this.page = page;
        this.size = size;
        this.field = field;
        this.sort = sort;
    }
}

export function toFindOption({ page, size, field, sort}: PageRequest) {
    const skip = (page - 1) * size;
    const take = size;
    const order = field ? { [field]: sort } : {}; // 기본 정렬 방식은 ASC

    return { skip, take, order };
}