export interface PageResult<T> {
    data: T[];
    page: number;
    totalPages: number;
    totalCount: number;
}