import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { PuzzleModel } from 'src/app/models/puzzles/PuzzleModel';
import { PuzzleService } from '../../services/puzzle.service';
import { PagedResponse } from 'src/app/models/1pagination/paged-response';
import { MatPaginator } from '@angular/material/paginator';
import { RequestFilters } from 'src/app/models/1pagination/request-filters';
import { Filter } from 'src/app/models/1pagination/filter';
import { LogicalOperator } from 'src/app/models/1pagination/logical-operator';
import { PagedRequest } from 'src/app/models/1pagination/paged-request';
import { MatSort } from '@angular/material/sort';
import { Subscription, merge } from 'rxjs';


@Component({
    templateUrl: './puzzles.component.html',
    styleUrls: ['./puzzles.component.css']
})
export class PuzzlesComponent implements OnInit, AfterViewInit, OnDestroy{
    
    puzzles: PuzzleModel[] = [];
    pagedPuzzles: PagedResponse<PuzzleModel>;
    requestFilters: RequestFilters;

    matSortSubscription: Subscription;
    subscriptions: Subscription[] = [];
    
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) matSort: MatSort;
    
    tableColumns: string[] = ['id', 'name', 'description', 'price', 'isWcaPuzzle', 'weight', 
    'manufacturer', 'puzzleType', 'color', 'difficultyLevel', 'materialType'];

    constructor(private puzzleService: PuzzleService){}
   
    
    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.loadPuzzlesFromApi();
        this.matSortSubscription = this.matSort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        merge(this.matSort.sortChange, this.paginator.page)
            .subscribe(() => this.loadPuzzlesFromApi());
    }

    openPageForEditingOrCreation(puzzleId: number): void{

    }

    onDelete(puzzleId: number, puzzleName: string){

    }

    loadPuzzlesFromApi(){
        var filters: Filter[] = [];
        this.requestFilters = {operator: LogicalOperator.OR, filters: filters};
        const request = new PagedRequest('', '', this.paginator.pageIndex, this.paginator.pageSize, this.requestFilters);
        this.puzzleService.getAllPuzzles(request)
            .subscribe((response: PagedResponse<PuzzleModel>) => {
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