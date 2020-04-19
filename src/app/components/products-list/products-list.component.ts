import { Component, OnInit, HostListener, ViewChild, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import { PuzzleTypeModel } from '../../models/puzzle-types/puzzle-type.model';
import { ManufacturerModel } from '../../models/manufacturers/manufacturer.model';
import { PuzzleLookupService } from '../../services/puzzle-lookup-service';
import { PuzzleColorModel } from '../../models/puzzle-colors/puzzle-color.model';
import { PagedResponse } from '../../infrastructure/pagination/paged-response';
import { PuzzleModel } from '../../models/puzzles/puzzle.model';
import { PagedRequest } from '../../infrastructure/pagination/paged-request';
import { RequestFilters } from '../../infrastructure/pagination/request-filters';
import { LogicalOperator } from '../../infrastructure/pagination/logical-operator';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Filter } from '../../infrastructure/pagination/filter';
import { MatSort } from '@angular/material/sort';
import { PuzzleTableRowModel } from 'src/app/models/puzzles/puzzle-table-row.model';
import { environment } from 'src/environments/environment';
import { ImageModel } from 'src/app/models/images/image.model';


@Component({
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component..css']
})
export class ProductsListComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges{

    rowsNumber: number;

    currentPuzzleType: PuzzleTypeModel;
    currentPuzzleTypeTitle: string;

    baseStaticFilesUrl: string = environment.staticFilesUrl;

    activatedRouteSubscr1: Subscription;
    activatedRouteSubscr2: Subscription;
    activatedRouteSubscr3: Subscription;
    subscriptions: Subscription[] = [];

    puzzleTypes: PuzzleTypeModel[];
    manufacturers: ManufacturerModel[];
    puzzleColors: PuzzleColorModel[];
    
    pagedPuzzles: PagedResponse<PuzzleTableRowModel>;
   
    requestFilters: RequestFilters;

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    

    constructor(private lookupService: PuzzleLookupService,
                private activatedRoute: ActivatedRoute,
                private router: Router){
                    let puzzles: PuzzleTableRowModel[] = [];
    }

    ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
        console.log('CHANGES: ' + changes);
    }

    onPageChanged(event){
        this.paginator.pageIndex = event.pageIndex;
        this.paginator.pageSize = event.pageSize;
        this.activatedRouteSubscr1 = this.activatedRoute.params.subscribe((val) => {
            this.getPuzzles(val.puzzleType);
            this.currentPuzzleTypeTitle = val.puzzleType;
            this.currentPuzzleType = this.puzzleTypes.filter(pt => pt.title == this.currentPuzzleTypeTitle)[0];
        });

        this.subscriptions.push(this.activatedRouteSubscr1);
        
        window.scroll(0,0);
    }

    
    onChangeMatSelect(value: string){
        console.log(value);
        var orderby: string = value.split(',')[0];
        var orderbyDirection: string = value.split(',')[1];
        console.log(`${orderby} | ${orderbyDirection}`);
        
        this.activatedRouteSubscr2 = this.activatedRoute.params
            .subscribe((val) => {
                this.getPuzzles(val.puzzleType, orderby, orderbyDirection);
                this.currentPuzzleTypeTitle = val.puzzleType;
                this.currentPuzzleType = this.puzzleTypes.filter(pt => pt.title == this.currentPuzzleTypeTitle)[0];
                console.log('OnChnage mat select ' + this.currentPuzzleTypeTitle);
            });

        this.subscriptions.push(this.activatedRouteSubscr2);
    }


    ngAfterViewInit(): void {
        this.activatedRouteSubscr3 = this.activatedRoute.params
            .subscribe((val) => {
                this.getPuzzles(val.puzzleType);
                this.currentPuzzleTypeTitle = val.puzzleType;
                if(this.puzzleTypes){
                    this.currentPuzzleType = this.puzzleTypes.filter(pt => pt.title == this.currentPuzzleTypeTitle)[0];
                }
                console.log('After view init ' + this.currentPuzzleTypeTitle);
            });

            this.subscriptions.push(this.activatedRouteSubscr3);
    }
   
    ngOnInit(): void {
        
        console.log();
        this.rowsNumber = (window.innerWidth <= 1100) ? 2 : 3;
        this.lookupService.getPuzzleTypes()
            .subscribe((pt: PuzzleTypeModel[]) => {
                this.puzzleTypes = pt;
                this.currentPuzzleType = pt.filter(pt => pt.title == this.currentPuzzleTypeTitle)[0];
                console.log('On init ' + this.currentPuzzleTypeTitle);
            });
        
        this.lookupService.getManufacturers()
            .subscribe((m: ManufacturerModel[]) => this.manufacturers = m);

        this.lookupService.getPuzzleColors()
            .subscribe((c: PuzzleColorModel[]) => this.puzzleColors = c);

    }

    private getPuzzles(val: any, orderby: string = 'name', orderbyDirection: string = 'asc'){
        var url = this.activatedRoute.snapshot.url.join().split(',');

        var filters: Filter[] = [];
        var filter: Filter = {propertyName: 'puzzleType', propertyValue: val};
        filters.push(filter);

        this.requestFilters = {operator: LogicalOperator.OR, filters: filters};
        
        const pagedRequest = new PagedRequest(orderby, orderbyDirection,this.paginator.pageIndex, 
                                                this.paginator.pageSize, 
                                                this.requestFilters);
        

        //console.log(pagedRequest);
        this.lookupService.getPuzzles(pagedRequest)
            .subscribe((pagedPuzzles: PagedResponse<PuzzleTableRowModel>) => {
                this.pagedPuzzles = pagedPuzzles;
            }, err => {console.log(err)});

       
    }

    @HostListener('window:resize', ['$event'])
    onResize(event){
        this.rowsNumber = (event.target.innerWidth <= 1100) ? 2 : 3;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscr => subscr.unsubscribe());
    }
}