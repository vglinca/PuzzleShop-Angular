import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { FilterColumn } from 'src/app/infrastructure/filter-column';
import { PagedResponse } from 'src/app/infrastructure/pagination/paged-response';
import { UserWithRolesModel } from 'src/app/models/users/user-with-roles.model';
import { RequestFilters } from 'src/app/infrastructure/pagination/request-filters';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Subscription, merge } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PagedRequest } from 'src/app/infrastructure/pagination/paged-request';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserRolesDialogComponent } from './dialog/user-roles-dialog.component';
import { AccountService } from 'src/app/services/account.service';
import { Filter } from 'src/app/infrastructure/pagination/filter';
import { LogicalOperator } from 'src/app/infrastructure/pagination/logical-operator';
import { NotificationService } from 'src/app/services/notification.service';
import { errorMessage } from 'src/app/common/consts/generic-error-message';

@Component({
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, AfterViewInit, OnDestroy{

    showSpinner: boolean = true;

    filterColumns: FilterColumn[] = [
        {name: 'firstName', property: 'firstName', useInSearch: true},
        {name: 'lastName', property: 'lastName', useInSearch: true},
        {name: 'userName', property: 'userName', useInSearch: true},
        {name: 'email', property: 'email', useInSearch: true},
        // {name: 'age', property: 'age', useInSearch: false},
        {name: 'id', property: 'id', useInSearch: false}
    ];

    currentId: number = 0;
    hasNotAdminRole: boolean = true;

    tableColumns: string[] = [];

    pagedUsers: PagedResponse<UserWithRolesModel>;

    requestFilters: RequestFilters;
    searchInput: FormControl = new FormControl('');

    matSortSubscription: Subscription;
    mergeSubscription: Subscription;
    dialogRefSubscription: Subscription;
    subscriptions: Subscription[] = [];

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) matSort: MatSort;

    constructor(private usersService: UsersService,
                private accountService: AccountService,
                private notificationService: NotificationService,
                private formBuilder: FormBuilder,
                private dialog: MatDialog){
        this.tableColumns = this.filterColumns.map(c => c.name);
    }


    ngOnInit(): void {
        this.hasNotAdminRole = this.accountService.hasNotAdminRole();
    }

    ngAfterViewInit(): void {
        this.currentId = this.accountService.parseToken().userId;
        this.loadUsersFromApi();
        this.matSortSubscription = this.matSort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.mergeSubscription = merge(this.matSort.sortChange, this.paginator.page).subscribe(() => this.loadUsersFromApi());

        this.subscriptions.push(this.matSortSubscription);
        this.subscriptions.push(this.mergeSubscription);
    }

    openManageRolesDialog(userId: number): void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = false;
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '460px';
        dialogConfig.height = "45%";
        dialogConfig.width = "30%";
        dialogConfig.data = userId;
        this.dialog.open(UserRolesDialogComponent, dialogConfig);
    }

    loadUsersFromApi(): void{
        const request: PagedRequest = new PagedRequest(this.matSort.active, this.matSort.direction, this.paginator.pageIndex, 
            this.paginator.pageSize, this.requestFilters);
        console.log(request);
        this.usersService.getPagedUsers(request)
            .subscribe((response: PagedResponse<UserWithRolesModel>) => {
                console.log(response);
                this.pagedUsers = response;
                this.showSpinner = false;
            }, err => this.notificationService.warn(errorMessage));
    }

    onResetClick(): void{
        this.requestFilters = {operator: LogicalOperator.AND, filters: []};
        this.loadUsersFromApi();
        this.searchInput.reset();
    }

    onSearchClick(): void{
        this.retrieveSearchValues();
        this.loadUsersFromApi();
    }

    private retrieveSearchValues(): void{
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

    ngOnDestroy(): void{
        this.subscriptions.forEach(s => {
            if(s){
                s.unsubscribe();
            }
        });
    }
}