import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { FilterColumn } from 'src/app/infrastructure/filter-column';
import { PagedResponse } from 'src/app/infrastructure/pagination/paged-response';
import { UserWithRolesModel } from 'src/app/models/users/user-with-roles.model';
import { RequestFilters } from 'src/app/infrastructure/pagination/request-filters';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription, merge } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PagedRequest } from 'src/app/infrastructure/pagination/paged-request';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserRolesDialogComponent } from './dialog/user-roles-dialog.component';

@Component({
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, AfterViewInit{

    filterColumns: FilterColumn[] = [
        {name: 'firstName', property: 'firstName', useInSearch: true},
        {name: 'lastName', property: 'lastName', useInSearch: true},
        {name: 'userName', property: 'userName', useInSearch: true},
        {name: 'email', property: 'email', useInSearch: true},
        {name: 'age', property: 'age', useInSearch: false},
        {name: 'id', property: 'id', useInSearch: false}
    ];

    tableColumns: string[] = [];

    pagedUsers: PagedResponse<UserWithRolesModel>;

    requestFilters: RequestFilters;
    filterForm: FormGroup;
    searchInput: FormControl = new FormControl('');

    matSortSubscription: Subscription;
    dialogRefSubscription: Subscription;
    subscriptions: Subscription[] = [];

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) matSort: MatSort;

    constructor(private usersService: UsersService,
                private dialog: MatDialog){
        this.tableColumns = this.filterColumns.map(c => c.name);
    }


    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.loadUsersFromApi();
        this.matSort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        merge(this.matSort.sortChange, this.paginator.page).subscribe(() => this.loadUsersFromApi());
    }

    openManageRolesDialog(userId: number): void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = false;
        dialogConfig.disableClose = true;
        dialogConfig.height = "45%";
        dialogConfig.width = "30%";
        dialogConfig.data = userId;
        this.dialog.open(UserRolesDialogComponent, dialogConfig);
    }

    loadUsersFromApi(): void{
        // debugger;
        const request: PagedRequest = new PagedRequest(this.matSort.active, this.matSort.direction, this.paginator.pageIndex, 
            this.paginator.pageSize, this.requestFilters);
        console.log(request);
        this.usersService.getPagedUsers(request)
            .subscribe((response: PagedResponse<UserWithRolesModel>) => {
                console.log(response);
                this.pagedUsers = response;
            }, err => console.log(err));
    }
}