export interface PagedResponse<T>{
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    hasPrev: boolean;
    hasNext: boolean;
    items: T[];
}