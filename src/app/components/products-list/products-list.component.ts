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
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { Filter } from '../../infrastructure/pagination/filter';
import { MatSort } from '@angular/material/sort';
import { PuzzleTableRowModel } from 'src/app/models/puzzles/puzzle-table-row.model';
import { environment } from 'src/environments/environment';
import { ImageModel } from 'src/app/models/images/image.model';
import { ThrowStmt } from '@angular/compiler';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AddToCartDialogComponent } from '../add-to-cart-dialog/add-to-cart-dialog.component';
import { OrderService } from 'src/app/services/order.service';
import { OrderItemForCreateModel } from 'src/app/models/order-items/order-item-for-create.model';
import { AccountService } from 'src/app/services/account.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserLoginComponent } from '../account/auth/user-login.component';


@Component({
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component..css']
})
export class ProductsListComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges{

    rowsNumber: number;
    showSpinner: boolean = true;

    currentPuzzleType: PuzzleTypeModel;
    prevPuzzleTypeTitle: string;
    currentPuzzleTypeTitle: string;

    baseStaticFilesUrl: string = environment.staticFilesUrl;

    sortOptions: SortingOption[] = SORTING_OPTIONS;
    currentSortOption: string;

    activatedRouteSubscr1: Subscription;
    activatedRouteSubscr2: Subscription;
    activatedRouteSubscr3: Subscription;
    routerSubscription: Subscription;
    subscriptions: Subscription[] = [];

    puzzleTypes: PuzzleTypeModel[];
    manufacturers: ManufacturerModel[];
    puzzleColors: PuzzleColorModel[];
    
    pagedPuzzles: PagedResponse<PuzzleTableRowModel>;
   
    requestFilters: RequestFilters;

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    

    constructor(private lookupService: PuzzleLookupService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private matDialog: MatDialog,
                private accountService: AccountService,
                private orderService: OrderService,
                private notificationService: NotificationService){
                    let puzzles: PuzzleTableRowModel[] = [];
    }

    ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
        console.log('CHANGES: ' + changes);
    }

    ngOnInit(): void {
        this.showSpinner = true;
        console.log();
        this.rowsNumber = (window.innerWidth <= 1100) ? 2 : 3;
        this.lookupService.getPuzzleTypes()
            .subscribe((pt: PuzzleTypeModel[]) => {
                this.puzzleTypes = pt;
                this.currentPuzzleType = pt.filter(pt => pt.title == this.currentPuzzleTypeTitle)[0];
            });
        
        this.lookupService.getManufacturers()
            .subscribe((m: ManufacturerModel[]) => this.manufacturers = m);

        this.lookupService.getPuzzleColors()
            .subscribe((c: PuzzleColorModel[]) => this.puzzleColors = c);

    }

    
    ngAfterViewInit(): void {
        this.showSpinner = true;
        this.routerSubscription = this.router.events.subscribe((e) => {
            if(e instanceof NavigationStart){
                this.paginator.pageIndex = 0;
                this.currentSortOption = this.sortOptions[0].value;
            }
        })

        this.activatedRouteSubscr3 = this.activatedRoute.params
            .subscribe((val) => {
                this.getPuzzles(val.puzzleType);
                this.currentPuzzleTypeTitle = val.puzzleType;
                if(this.puzzleTypes){
                    this.currentPuzzleType = this.puzzleTypes.filter(pt => pt.title == this.currentPuzzleTypeTitle)[0];
                }
            });

        this.subscriptions.push(this.activatedRouteSubscr3);
    }
   
    onPageChanged(event){
        this.showSpinner = true;
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
        this.showSpinner = true;
        console.log(value);
        var orderby: string = value.split(',')[0];
        var orderbyDirection: string = value.split(',')[1];
        console.log(`${orderby} | ${orderbyDirection}`);

        this.currentSortOption = value;
        
        this.activatedRouteSubscr2 = this.activatedRoute.params
            .subscribe((val) => {
                this.paginator.pageIndex = 0;
                this.getPuzzles(val.puzzleType, orderby, orderbyDirection);
                this.currentPuzzleTypeTitle = val.puzzleType;
                this.currentPuzzleType = this.puzzleTypes.filter(pt => pt.title == this.currentPuzzleTypeTitle)[0];
                
            });

        this.subscriptions.push(this.activatedRouteSubscr2);
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
        
        this.lookupService.getPuzzles(pagedRequest)
            .subscribe((pagedPuzzles: PagedResponse<PuzzleTableRowModel>) => {
                this.pagedPuzzles = pagedPuzzles;
                this.showSpinner = false;
            }, err => {console.log(err)});
    }

    openProductDetails(id: number): void{
        this.router.navigate(['/collections', this.currentPuzzleType.title, id], 
            {queryParams: {puzzletype: this.currentPuzzleType.isRubicsCube ? `${this.currentPuzzleType.title} SpeedCubes` : this.currentPuzzleType.title}});
    }

    addToCart(puzzle: PuzzleTableRowModel): void{
        if(this.accountService.isAuthenticated()){

            let orderItem: OrderItemForCreateModel = {
                puzzleId: puzzle.id,
                quantity: 1,
                cost: puzzle.price,
                userId: this.accountService.parseToken().userId
            };
            this.orderService.editCart(orderItem)
                .subscribe(() => {
                    const dialogConfig = new MatDialogConfig();
                    dialogConfig.autoFocus = true;
                    dialogConfig.disableClose = false;
                    dialogConfig.height = "35%";
                    dialogConfig.width = "35%";
                    dialogConfig.data = {
                        puzzleName: puzzle.name,
                        puzzleColor: puzzle.color,
                        puzzleType: puzzle.puzzleType,
                        imageLink: puzzle.images[0].fileName
                    };
                    this.matDialog.open(AddToCartDialogComponent, dialogConfig);
                }, err => this.notificationService.warn('Some problem happened.'));
        }else{
            const dialogConfig = new MatDialogConfig();
            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = false;
            dialogConfig.height = "70%";
            dialogConfig.width = "30%";
            this.matDialog.open(UserLoginComponent, dialogConfig);
        }

    }


    @HostListener('window:resize', ['$event'])
    onResize(event){
        this.rowsNumber = (event.target.innerWidth <= 1100) ? 2 : 3;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscr => subscr.unsubscribe());
    }
}

export interface SortingOption{
    value: string;
    title: string;
}

const SORTING_OPTIONS: SortingOption[] = [
    {
        title: 'A-Z by title',
        value: 'name,asc'
    },
    {
        title: 'Z-A by title',
        value: 'name,desc'
    },
    {
        title: 'A-Z by manufacturer',
        value: 'manufacturer,asc'
    },
    {
        title: 'Z-A by manufacturer',
        value: 'manufacturer,desc'
    },
    {
        title: 'By price, low to high',
        value: 'price,asc'
    },
    {
        title: 'By price, high to low',
        value: 'price,desc'
    }
]