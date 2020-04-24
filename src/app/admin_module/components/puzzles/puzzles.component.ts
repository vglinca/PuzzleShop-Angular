import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { PuzzleModel } from 'src/app/models/puzzles/puzzle.model';
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


@Component({
    templateUrl: './puzzles.component.html',
    styleUrls: ['./puzzles.component.css']
})
export class PuzzlesComponent implements OnInit, AfterViewInit, OnDestroy{
    
    puzzles: PuzzleTableRowModel[] = [];
    pagedPuzzles: PagedResponse<PuzzleTableRowModel>;
    requestFilters: RequestFilters;

    matSortSubscription: Subscription;
    dialogRefSubscription: Subscription;
    subscriptions: Subscription[] = [];
    
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) matSort: MatSort;
    
    tableColumns: string[] = ['id', 'name', 'description', 'price', 'isMagnetic', 'weight', 
    'manufacturer', 'puzzleType', 'color', 'materialType', 'availableInStock'];

    constructor(private puzzleService: PuzzleService,
                private dialogService: ConfirmDialogService,
                public snackBar: MatSnackBar){}
   
    
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
        var filters: Filter[] = [];
        this.requestFilters = {operator: LogicalOperator.OR, filters: filters};
        const request = new PagedRequest(this.matSort.active, this.matSort.direction, this.paginator.pageIndex, this.paginator.pageSize, this.requestFilters);
        this.puzzleService.getAllPuzzles(request)
            .subscribe((response: PagedResponse<PuzzleTableRowModel>) => {
                this.pagedPuzzles = response;
                this.puzzles = response.items;
            });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscr => {
            if(subscr){
                subscr.unsubscribe();
            }
        })
    }
}