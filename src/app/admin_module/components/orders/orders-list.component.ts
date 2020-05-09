import { Component, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { PagedResponse } from 'src/app/infrastructure/pagination/paged-response';
import { OrderModel } from 'src/app/models/orders/order.model';
import { RequestFilters } from 'src/app/infrastructure/pagination/request-filters';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription, merge } from 'rxjs';
import { FilterColumn } from 'src/app/infrastructure/filter-column';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ManageOrderService } from 'src/app/services/manage-order.service';
import { PagedRequest } from 'src/app/infrastructure/pagination/paged-request';
import { PuzzleLookupService } from 'src/app/services/lookup.service';
import { OrderStatusModel } from 'src/app/models/order-status/order-status.model';
import { OrderTableRowModel } from 'src/app/models/orders/order-table-row.model';
import { AccountService } from 'src/app/services/account.service';
import { Filter } from 'src/app/infrastructure/pagination/filter';
import { LogicalOperator } from 'src/app/infrastructure/pagination/logical-operator';
import { OrderStatusId } from 'src/app/models/order-status/order-status-id';

@Component({
    templateUrl: './orders-list.component.html',
    styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit, AfterViewInit, OnDestroy{

    pagedOrders: PagedResponse<OrderTableRowModel>;
    orderStatusList: OrderStatusModel[] = [];

    requestFilters: RequestFilters;
    filterForm1: FormGroup;
    filterForm2: FormGroup;
    orderStatusForm: FormGroup;
    searchInput: FormControl = new FormControl('');

    matSortSubscription: Subscription;
    dialogRefSubscription: Subscription;
    subscriptions: Subscription[] = [];

    filterColumns: FilterColumn[] = [
        {name: 'orderStatusId', property: 'orderStatusId', useInSearch: false},
        {name: 'contactEmail', property: 'contactEmail', useInSearch: true},
        {name: 'orderDate', property: 'orderDate', useInSearch: false},
        {name: 'address', property: 'address', useInSearch: true},
        {name: 'city', property: 'city', useInSearch: true},
        {name: 'country', property: 'country', useInSearch: true},
        {name: 'totalItems', property: 'totalItems', useInSearch: false},
        {name: 'totalCost', property: 'totalCost', useInSearch: false},
        {name: 'id', property: 'id', useInSearch: false}
    ];

    orderStatusSelect: OrderStatusModel[] = [
        {orderStatusId: OrderStatusId.AwaitingPayment, name: 'AwaitingPayment'},
        {orderStatusId: OrderStatusId.AwaitingShipment, name: 'AwaitingShipment'},
        {orderStatusId: OrderStatusId.Cancelled, name: 'Cancelled'},
        {orderStatusId: OrderStatusId.Completed, name: 'Completed'},
        {orderStatusId: OrderStatusId.ConfirmedPayment, name: 'ConfirmedPayment'},
        {orderStatusId: OrderStatusId.Declined, name: 'AwaitingPayment'},
        {orderStatusId: OrderStatusId.Refunded, name: 'Refunded'}
    ]

    searchingColumns: FilterColumn[] = [];
    
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) matSort: MatSort;
    
    tableColumns: string[] = [];

    constructor(private formBuilder: FormBuilder,
                private accountService: AccountService,
                private manageOrdersService: ManageOrderService,
                private lookupService: PuzzleLookupService){
            this.tableColumns = this.filterColumns.map(c => c.name);
            this.searchingColumns = this.filterColumns.filter(c => c.useInSearch);
            this.filterForm1 = this.formBuilder.group({
                filter: [''],
                propertyValue: [''],
            });
            this.filterForm2 = this.formBuilder.group({
                filter: [''],
                propertyValue: [''],
            });
            this.orderStatusForm = this.formBuilder.group({
                orderStatus: ['']
            });
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
        const request = new PagedRequest(this.matSort.active, this.matSort.direction, this.paginator.pageIndex, 
            this.paginator.pageSize, this.requestFilters);
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

    resetAll(): void{
        this.requestFilters = {operator: LogicalOperator.AND, filters: []};
        this.loadOrdersFromApi();
        this.searchInput.reset();
        this.filterForm1.reset();
        this.filterForm2.reset();
    }

    onSearchClick(): void{
        this.createFiltersFromSearch();
        this.loadOrdersFromApi();
    }

    
    private createFiltersFromSearch(): void{
        const searchField = this.searchInput.value.trim();
        if(searchField){
            const filters: Filter[] = [];
            this.filterColumns.forEach(column => {
                if(column.useInSearch){
                    const filter: Filter = {propertyName: column.property, propertyValue: searchField};
                    filters.push(filter);
                }
            });
            this.requestFilters = {operator: LogicalOperator.OR, filters: filters};
        }
    }

    filterOrders(): void{
        this.createFiltersFromForm();
        this.loadOrdersFromApi();
    }

    createFiltersFromForm(): void{
        const filters: Filter[] = [];
        if(this.filterForm1.controls.propertyValue.value){
            const filter: Filter = {propertyName: this.filterForm1.controls.filter.value, 
                propertyValue: this.filterForm1.controls.propertyValue.value};
            filters.push(filter);
        }if(this.filterForm2.controls.propertyValue.value){
            const filter: Filter = {propertyName: this.filterForm2.controls.filter.value, 
                propertyValue: this.filterForm2.controls.propertyValue.value};
            filters.push(filter);
        }
        // if(this.orderStatusForm.controls.orderStatus.value){
        //     const filter: Filter = {propertyName: 'orderStatusId', propertyValue: this.orderStatusForm.controls.orderStatus.value};
        //     filters.push(filter);
        // }
        this.requestFilters = {operator: LogicalOperator.AND, filters: filters};
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            if(s){
                s.unsubscribe();
            }
        });
    }
}