import { Component, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
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
import { PuzzleLookupService } from 'src/app/services/puzzle-lookup-service';
import { OrderStatusModel } from 'src/app/models/order-status/order-status.model';
import { OrderTableRowModel } from 'src/app/models/orders/order-table-row.model';

@Component({
    templateUrl: './orders-list.component.html',
    styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit, AfterViewInit, OnDestroy{

    pagedOrders: PagedResponse<OrderTableRowModel>;
    orderStatusList: OrderStatusModel[] = [];

    requestFilters: RequestFilters;
    filterForm: FormGroup;
    searchInput: FormControl = new FormControl('');

    matSortSubscription: Subscription;
    dialogRefSubscription: Subscription;
    subscriptions: Subscription[] = [];

    filterColumns: FilterColumn[] = [
        {name: 'orderStatus', property: 'orderStatus', useInSearch: true},
        {name: 'contactEmail', property: 'contactEmail', useInSearch: true},
        {name: 'orderDate', property: 'orderDate', useInSearch: false},
        {name: 'address', property: 'address', useInSearch: true},
        {name: 'city', property: 'city', useInSearch: true},
        {name: 'country', property: 'country', useInSearch: true},
        {name: 'totalItems', property: 'totalItems', useInSearch: false},
        {name: 'totalCost', property: 'totalCost', useInSearch: false},
        {name: 'id', property: 'id', useInSearch: false}
    ];
    
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) matSort: MatSort;
    
    tableColumns: string[] = [];

    constructor(private formBuilder: FormBuilder,
                private manageOrdersService: ManageOrderService,
                private lookupService: PuzzleLookupService){
                this.tableColumns = this.filterColumns.map(c => c.name);
    }

    ngOnInit(): void {
        this.loadOrderStatusList();
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
            .subscribe((resp: PagedResponse<OrderTableRowModel>) => {
                this.pagedOrders = resp;
            }, err => console.log(err));
    }

    private loadOrderStatusList(): void{
        this.lookupService.getOrderStatusList()
            .subscribe((os: OrderStatusModel[]) =>{
                this.orderStatusList = os;
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