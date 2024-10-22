export class PageResult<T> {
    data: T[];
    page: number;
    totalPages: number;
    totalCount: number;

    constructor(data: T[], totalCount: number, page: number, size: number) {
        this.data = data;
        this.page = page;
        this.totalPages = Math.ceil(totalCount / size);
        this.totalCount = totalCount;
    }

    // 기존의 toPageResult 함수는 생성자로 대체되었음
}
