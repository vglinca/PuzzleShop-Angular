import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { PuzzleLookupService } from 'src/app/services/puzzle-lookup-service';
import { PuzzleTableRowModel } from 'src/app/models/puzzles/puzzle-table-row.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { PuzzleModel } from 'src/app/models/puzzles/puzzle.model';
import { PuzzleTypesService } from 'src/app/services/puzzle-types.service';
import { PuzzleTypeTableRowModel } from 'src/app/models/puzzle-types/puzzle-type-table-row.model';
import { PuzzleColorsService } from 'src/app/services/puzzle-colors.service';
import { PuzzleColorModel } from 'src/app/models/puzzle-colors/puzzle-color.model';
import { environment } from 'src/environments/environment';
import { map, mergeMap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddToCartDialogComponent } from '../add-to-cart-dialog/add-to-cart-dialog.component';
import { AccountService } from 'src/app/services/account.service';
import { OrderService } from 'src/app/services/order.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderItemForCreateModel } from 'src/app/models/order-items/order-item-for-create.model';
import { UserLoginComponent } from '../account/auth/user-login.component';
import { GalleryItem, ImageItem } from '@ngx-gallery/core';
import { ImageModel } from 'src/app/models/images/image.model';
import { StarRatingColor } from 'src/app/common/star-rating/star-rating.component';


@Component({
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

    staticFilesUrl: string = environment.staticFilesUrl;
    puzzleImages: ImageModel[] = [];
    images: GalleryItem[] = [];

    puzzle: PuzzleTableRowModel;
    difficultyLevel: string;
    puzzleId: number;
    queryParam: string;
    colors: PuzzleColorModel[] = [];

    quantity: number = 1;
    subtotal: number;

    starCount: number = 5;
    ratingArr: number[] = [];
    rating: number = 0;
    starColor: StarRatingColor = StarRatingColor.accent;

    showReviews: boolean = false;

    activatedRouteSubscription1: Subscription;
    activatedRouteSubscription2: Subscription;
    subscriptions: Subscription[] = [];

    constructor(private lookupService: PuzzleLookupService,
        private puzzleService: PuzzleService,
        private puzzleTypeService: PuzzleTypesService,
        private puzzleColorService: PuzzleColorsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private accountService: AccountService,
        private orderService: OrderService,
        private notificationService: NotificationService,
        private matDialog: MatDialog) {
    }

    ngOnInit(): void {
        for(let i = 0; i < this.starCount; i++){
            this.ratingArr.push(i);
        }

        this.activatedRoute.data.subscribe((data: {images: ImageModel[]}) => {
            data.images.forEach(image => {
                this.images.push(new ImageItem({src: this.staticFilesUrl + image.fileName, thumb: this.staticFilesUrl + image.fileName}));
            });
        });

        this.activatedRoute.data.subscribe((data: {puzzle: PuzzleTableRowModel}) => {
            this.rating = data.puzzle.rating;
            this.puzzle = data.puzzle;
            this.subtotal = this.puzzle.price;
            this.rating = this.puzzle.rating;
            this.puzzleId = data.puzzle.id;
            this.loadDataFromApi();
        });

        // this.activatedRouteSubscription1 = this.activatedRoute.paramMap.subscribe(params => {
        //     this.puzzleId = +params.get('id');
        //     console.log(this.puzzleId);
        //     this.loadDataFromApi();
        // });
        this.activatedRouteSubscription2 = this.activatedRoute.queryParams.subscribe(params => {
            this.queryParam = params['puzzletype'];
        });
        

        //this.subscriptions.push(this.activatedRouteSubscription1);
        this.subscriptions.push(this.activatedRouteSubscription2);
    }

    ngAfterViewInit(): void {
    }

    showStar(index: number): string{
        if (this.rating >= index + 1 && (this.rating - index - 1) >= 0.8) {
			return 'star';
        } 
        else if(this.rating >= index + 1 && (this.rating - index - 1) < 0.8){
            return 'star_half';
        }
        else {
			return 'star_border';
		}
    }

    loadDataFromApi(): void {

        //const puzzle = this.lookupService.getPuzzle(this.puzzleId);
        const puzzleType = this.puzzleService.getPuzzle(this.puzzleId)
            .pipe(mergeMap((p: PuzzleModel) =>
                this.puzzleTypeService.getByIdFriendly(p.puzzleTypeId)));

        const colors = this.puzzleColorService.getAll();

        forkJoin(puzzleType, colors)
            .subscribe(([pt, c]) => {
                this.colors = c;
                // this.puzzle = p;
                this.difficultyLevel = pt.difficultyLevel;
                //this.subtotal = this.puzzle.price;
                //this.rating = this.puzzle.rating;
            });
    }

    navigateToCollections(): void {
        this.router.navigate(['/collections', this.puzzle.puzzleType]);
    }

    incrementQuantity(): void {
        if (this.quantity < this.puzzle.availableInStock) {
            this.quantity++;
            this.subtotal += this.puzzle.price;
        }
    }

    decrementQuantity(): void {
        if (this.quantity > 1) {
            this.quantity--;
            this.subtotal -= this.puzzle.price;
        }
    }

    onRatingChanged(rating: number): void{
        this.rating = rating;
    }

    toggleReviews():void {
        this.showReviews = !this.showReviews;
    }

    addToCart(): void{
        if(this.accountService.isAuthenticated()){
            let orderItem: OrderItemForCreateModel = {
                puzzleId: this.puzzle.id,
                quantity: this.quantity,
                cost: this.subtotal,
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
                        puzzleName: this.puzzle.name,
                        puzzleColor: this.puzzle.color,
                        puzzleType: this.puzzle.puzzleType,
                        imageLink: this.puzzle.images[0].fileName
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


    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            if (s) {
                s.unsubscribe();
            }
        });
    }
}