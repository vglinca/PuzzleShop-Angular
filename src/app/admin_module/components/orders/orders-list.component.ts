import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { PagedResponse } from 'src/app/infrastructure/pagination/paged-response';
import { OrderModel } from 'src/app/models/orders/order.model';
import { RequestFilters } from 'src/app/infrastructure/pagination/request-filters';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Subscription, merge } from 'rxjs';
import { FilterColumn } from 'src/app/infrastructure/filter-column';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ManageOrderService } from 'src/app/services/manage-order.service';
import { PagedRequest } from 'src/app/infrastructure/pagination/paged-request';

@Component({
    templateUrl: './orders-list.component.html',
    styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements AfterViewInit, OnDestroy{

    pagedOrders: PagedResponse<OrderModel>;

    requestFilters: RequestFilters;
    filterForm: FormGroup;
    searchInput: FormControl = new FormControl('');

    matSortSubscription: Subscription;
    dialogRefSubscription: Subscription;
    subscriptions: Subscription[] = [];

    filterColumns: FilterColumn[] = [
        {name: 'orderStatus', property: 'orderStatus', useInSearch: true},
        {name: 'userId', property: 'userId', useInSearch: false},
        {name: 'orderDate', property: 'orderDate', useInSearch: false},
        {name: 'totalItems', property: 'totalItems', useInSearch: false},
        {name: 'totalCost', property: 'totalCost', useInSearch: false},
        {name: 'id', property: 'id', useInSearch: false}
    ];
    
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) matSort: MatSort;
    
    tableColumns: string[] = [];

    constructor(private formBuilder: FormBuilder,
                private manageOrdersService: ManageOrderService){
                this.tableColumns = this.filterColumns.map(c => c.name);
    }
    
    ngAfterViewInit(): void {
        this.loadOrdersFromApi();
        this.matSortSubscription = this.matSort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        merge(this.matSort.sortChange, this.paginator.page)
            .subscribe(() => this.loadOrdersFromApi());
    }

    loadOrdersFromApi(): void{
        const request = new PagedRequest(this.matSort.active, this.matSort.direction, this.paginator.pageIndex, this.paginator.pageSize, this.requestFilters);
        console.log(request);
        this.manageOrdersService.getOrdersPaged(request)
            .subscribe((resp: PagedResponse<OrderModel>) => {
                this.pagedOrders = resp;
            }, err => console.log(err));
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            if(s){
                s.unsubscribe();
            }
        });
    }
}