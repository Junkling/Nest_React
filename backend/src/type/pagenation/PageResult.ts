export interface PageResult<T> {
    data: T[];
    page: number;
    totalPages: number;
    totalCount: number;
}
export function toPageResult<T>(
    data: T[],
    totalCount: number,
    page: number,
    size: number
): PageResult<T> {
    const totalPages = Math.ceil(totalCount / size);
    return {
        data,
        page,
        totalPages,
        totalCount,
    };
}
