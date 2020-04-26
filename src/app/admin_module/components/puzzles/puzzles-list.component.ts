import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { PuzzleService } from '../../../services/puzzle.service';
import { PagedResponse } from 'src/app/infrastructure/pagination/paged-response';
import { MatPaginator } from '@angular/material/paginator';
import { RequestFilters } from 'src/app/infrastructure/pagination/request-filters';
import { Filter } from 'src/app/infrastructure/pagination/filter';
import { LogicalOperator } from 'src/app/infrastructure/pagination/logical-operator';
import { PagedRequest } from 'src/app/infrastructure/pagination/paged-request';
import { MatSort } from '@angular/material/sort';
import { Subscription, merge } from 'rxjs';
import { ConfirmDialogService } from '../../../common/confirm_dialog/confirm-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PuzzleTableRowModel } from 'src/app/models/puzzles/puzzle-table-row.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FilterColumn } from 'src/app/infrastructure/filter-column';


@Component({
    templateUrl: './puzzles-list.component.html',
    styleUrls: ['./puzzles-list.component.css']
})
export class PuzzlesComponent implements OnInit, AfterViewInit, OnDestroy{
    
    puzzles: PuzzleTableRowModel[] = [];
    pagedPuzzles: PagedResponse<PuzzleTableRowModel>;
    requestFilters: RequestFilters;
    filterForm: FormGroup;
    searchInput: FormControl = new FormControl('');

    matSortSubscription: Subscription;
    dialogRefSubscription: Subscription;
    subscriptions: Subscription[] = [];

    filterColumns: FilterColumn[] = [
        {name: 'availableInStock', property: 'availableInStock', useInSearch: false},
        {name: 'name', property: 'name', useInSearch: true},
        {name: 'manufacturer', property: 'manufacturer', useInSearch: true},
        {name: 'price', property: 'price', useInSearch: false},
        {name: 'isMagnetic', property: 'isMagnetic', useInSearch: false},
        {name: 'weight', property: 'weight', useInSearch: false},
        {name: 'puzzleType', property: 'puzzleType', useInSearch: true},
        {name: 'color', property: 'color', useInSearch: true},
        {name: 'materialType', property: 'materialType', useInSearch: false},
        {name: 'id', property: 'id', useInSearch: false}
    ];
    
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) matSort: MatSort;
    
    tableColumns: string[] = [];
    // ['availableInStock', 'name', 'price', 'isMagnetic', 'weight', 
    // 'manufacturer', 'puzzleType', 'color', 'materialType', 'id'];

    constructor(private puzzleService: PuzzleService,
                private dialogService: ConfirmDialogService,
                private formBuilder: FormBuilder,
                public snackBar: MatSnackBar){
                    this.tableColumns = this.filterColumns.map(c => c.name);
                    this.filterForm = this.formBuilder.group({
                        name: [''],
                        manufacturer: ['']
                    });
                }
   
    
    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.loadPuzzlesFromApi();
        this.matSortSubscription = this.matSort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        merge(this.matSort.sortChange, this.paginator.page)
            .subscribe(() => this.loadPuzzlesFromApi());
    }

    onDelete(puzzleId: number, puzzleName: string){
        const msg: string = `Are you sure to delete this puzzle? (${name})`;
        const dialogRef = this.dialogService.openConfirmDialog(msg);

        this.dialogRefSubscription = dialogRef.afterClosed()
            .subscribe(action => {
                if(action === dialogRef.componentInstance.ACTION_CONFIRM){
                    this.puzzleService.deletePuzzle(puzzleId)
                        .subscribe(() =>{
                            this.loadPuzzlesFromApi();
                            this.snackBar.open(`Puzzle ${puzzleName} has been deleted from catalog.`, 'Hide', {duration: 2000});
                        }, err => {
                            this.snackBar.open('Something wrong happened during deletion.', 'Hide', {duration: 2000});
                        });
                }
            });
        this.subscriptions.push(this.dialogRefSubscription);
    }

    loadPuzzlesFromApi(){
        // var filters: Filter[] = [];
        // this.requestFilters = {operator: LogicalOperator.OR, filters: filters};
        const request = new PagedRequest(this.matSort.active, this.matSort.direction, this.paginator.pageIndex, this.paginator.pageSize, this.requestFilters);
        console.log(request);
        this.puzzleService.getAllPuzzles(request)
            .subscribe((response: PagedResponse<PuzzleTableRowModel>) => {
                this.pagedPuzzles = response;
                this.puzzles = response.items;
            });
    }

    resetAll(): void{
        this.requestFilters = {operator: LogicalOperator.AND, filters: []};
        this.loadPuzzlesFromApi();
        this.searchInput.reset();
        this.filterForm.reset();
    }

    onSearchClick(): void{
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
        this.loadPuzzlesFromApi();
    }

    filterPuzzles(): void{
        this.retrieveFilteringValuesFromForm();
        this.loadPuzzlesFromApi();
    }

    private retrieveFilteringValuesFromForm(): void{
        if(this.filterForm.value){
            const filters: Filter[] = [];
            Object.keys(this.filterForm.controls).forEach(key => {
                const controlValue = this.filterForm.controls[key].value;
                if(controlValue){
                    const column: FilterColumn = [...this.filterColumns].find(c => c.name === key);
                    if(column){
                        const filter: Filter = {propertyName: column.property, propertyValue: controlValue};
                        filters.push(filter);
                    }
                }
            });
            this.requestFilters = {operator: LogicalOperator.AND, filters: filters};
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscr => {
            if(subscr){
                subscr.unsubscribe();
            }
        });
    }
}
