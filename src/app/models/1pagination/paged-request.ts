import { RequestFilters } from './request-filters';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export class PagedRequest{
    orderBy: string;
    orderByDirection: string;
    pageNumber: number;
    pageSize: number;
    requestFilters: RequestFilters;

    constructor(pageNumber: number, pageSize: number, filters: RequestFilters){
        this.orderBy = '';
        this.orderByDirection = '';
        this.pageNumber = pageNumber + 1;
        this.pageSize = pageSize;
        this.requestFilters = filters;
    }
}