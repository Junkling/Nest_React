
export interface PageRequest {
    page: number;
    size: number;
    field?: string;
    sort?: 'ASC' | 'DESC'; // 정렬은 선택적
}

export function toFindOption({ page, size, field, sort}: PageRequest) {
    const skip = (page - 1) * size;
    const take = size;
    const order = field ? { [field]: sort } : {}; // 기본 정렬 방식은 ASC

    return { skip, take, order };
}