import { Component, OnInit, HostListener, ViewChild, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import { PuzzleTypeModel } from '../../models/puzzle-types/puzzle-type.model';
import { ManufacturerModel } from '../../models/manufacturers/manufacturer.model';
import { PuzzleLookupService } from '../../services/lookup.service';
import { PuzzleColorModel } from '../../models/puzzle-colors/puzzle-color.model';
import { PagedResponse } from '../../infrastructure/pagination/paged-response';
import { PuzzleModel } from '../../models/puzzles/puzzle.model';
import { PagedRequest } from '../../infrastructure/pagination/paged-request';
import { RequestFilters } from '../../infrastructure/pagination/request-filters';
import { LogicalOperator } from '../../infrastructure/pagination/logical-operator';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription, merge, forkJoin } from 'rxjs';
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
import { PuzzleService } from 'src/app/services/puzzle.service';
import { PuzzleTypesService } from 'src/app/services/puzzle-types.service';
import { PuzzleTypeTableRowModel } from 'src/app/models/puzzle-types/puzzle-type-table-row.model';
import { ManufacturersService } from 'src/app/services/manufacturers.service';
import { PuzzleColorsService } from 'src/app/services/puzzle-colors.service';
import { errorMessage } from 'src/app/common/consts/generic-error-message';
import { FormControl } from '@angular/forms';


export interface SortingOption{
    value: string;
    title: string;
}

const SORTING_OPTIONS: SortingOption[] = [
    {title: 'A-Z by title',value: 'name,asc'},
    {title: 'Z-A by title',value: 'name,desc'},
    {title: 'A-Z by manufacturer',value: 'manufacturer,asc'},
    {title: 'Z-A by manufacturer',value: 'manufacturer,desc'},
    {title: 'By price, low to high',value: 'price,asc'},
    {title: 'By price, high to low',value: 'price,desc'},
    {title: 'By rating, high to low',value: 'rating,desc'}
]


@Component({
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, AfterViewInit, OnDestroy{

    rowsNumber: number;
    showSpinner: boolean = true;

    selectFormControl: FormControl = new FormControl('');

    currentPuzzleType: PuzzleTypeTableRowModel;
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

    puzzleTypes: PuzzleTypeTableRowModel[];
    manufacturers: ManufacturerModel[];
    puzzleColors: PuzzleColorModel[];
    
    pagedPuzzles: PagedResponse<PuzzleTableRowModel>;
   
    requestFilters: RequestFilters;

    ratingArr: number[] = [];
    starCount: number = 5;

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    
    constructor(
                private manufacturerService: ManufacturersService,
                private colorService: PuzzleColorsService,
                private puzzleTypeService: PuzzleTypesService,
                private puzzleService: PuzzleService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private matDialog: MatDialog,
                private accountService: AccountService,
                private orderService: OrderService,
                private notificationService: NotificationService){
                    let puzzles: PuzzleTableRowModel[] = [];
    }

    ngOnInit(): void {
        this.ratingArr = [];
        this.currentSortOption = this.sortOptions[0].value;
        for(let i = 0; i < this.starCount; i++){
            this.ratingArr.push(i);
        }

        this.showSpinner = true;
        this.rowsNumber = (window.innerWidth <= 1100) ? 2 : 3;

        const puzzleTypes = this.puzzleTypeService.getAll();
        const manufacturers = this.manufacturerService.getAll();
        const colors = this.colorService.getAll();

        forkJoin(puzzleTypes, manufacturers, colors)
            .subscribe(([pt, m, c]) => {
                this.puzzleTypes = pt;
                this.currentPuzzleType = pt.filter(pt => pt.title == this.currentPuzzleTypeTitle)[0];
                this.manufacturers = m;
                this.puzzleColors = c;
            });
    }

    
    ngAfterViewInit(): void {
        this.showSpinner = true;
        this.routerSubscription = this.router.events.subscribe((e) => {
            if(e instanceof NavigationStart){
                this.paginator.pageIndex = 0;
                this.currentSortOption = this.sortOptions[0].title;
                // console.log('AFTER VIEW INIT ', val.puzzleType);
            }
        })

        this.activatedRouteSubscr3 = this.activatedRoute.params
            .subscribe((val) => {
                this.getPuzzles(val.puzzleType);
                this.currentPuzzleTypeTitle = val.puzzleType;
                if(this.puzzleTypes){
                    this.currentPuzzleType = this.puzzleTypes.filter(pt => pt.title === this.currentPuzzleTypeTitle)[0];
                }
            });

        this.subscriptions.push(this.routerSubscription);
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
        var orderby: string = value.split(',')[0];
        var orderbyDirection: string = value.split(',')[1];

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
        
        this.puzzleService.getAllPuzzles(pagedRequest)
            .subscribe((pagedPuzzles: PagedResponse<PuzzleTableRowModel>) => {
                this.pagedPuzzles = pagedPuzzles;
                this.showSpinner = false;
            }, err => this.notificationService.warn(errorMessage));
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
                    dialogConfig.minWidth = '440px';
                    dialogConfig.height = '35%';
                    dialogConfig.width = '35%';
                    dialogConfig.data = {
                        puzzleName: puzzle.name,
                        puzzleColor: puzzle.color,
                        puzzleType: puzzle.puzzleType,
                        imageLink: puzzle.images[0].fileName
                    };
                    this.matDialog.open(AddToCartDialogComponent, dialogConfig);
                }, err => this.notificationService.warn(errorMessage));
        }else{
            const dialogConfig = new MatDialogConfig();
            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = false;
            dialogConfig.minWidth = '440px';
		    dialogConfig.height = '70%';
		    dialogConfig.width = '30%';
            this.matDialog.open(UserLoginComponent, dialogConfig);
        }
    }


    @HostListener('window:resize', ['$event'])
    onResize = (event) => this.rowsNumber = (event.target.innerWidth < 1000) ? 1 : ((event.target.innerWidth <= 1100 && event.target.innerWidth >= 1000) ? 2 : 3);
    

    showStarUsingRating(index: number, rating: number): string{
        if (rating >= index + 1 && (rating - index - 1) >= 0.8) {
			return 'star';
        }else if(rating >= index + 1 && (rating - index - 1) < 0.8){
            return 'star_half';
        }else {
			return 'star_border';
		}
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s =>{
            if(s){
                s.unsubscribe();
            }
        });
    }
}
