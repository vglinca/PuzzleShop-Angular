import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { PuzzleLookupService } from 'src/app/services/puzzle-lookup-service';
import { PuzzleTableRowModel } from 'src/app/models/puzzles/puzzle-table-row.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { PuzzleModel } from 'src/app/models/puzzles/puzzle.model';
import { PuzzleTypesService } from 'src/app/services/puzzle-types.service';
import { PuzzleTypeTableRowModel } from 'src/app/models/puzzle-types/puzzle-type-table-row.model';
import { PuzzleColorsService } from 'src/app/services/puzzle-colors.service';
import { PuzzleColorModel } from 'src/app/models/puzzle-colors/puzzle-color.model';
import { environment } from 'src/environments/environment';


@Component({
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit, OnDestroy{

    staticFilesUrl: string = environment.staticFilesUrl;

    puzzle: PuzzleTableRowModel;
    difficultyLevel: string;
    puzzleId: number;
    queryParam: string;
    colors: PuzzleColorModel[] = [];

    quantity: number = 1;
    subtotal: number;

    activatedRouteSubscription1: Subscription;
    activatedRouteSubscription2: Subscription;
    subscriptions: Subscription[] = [];

    constructor(private lookupService: PuzzleLookupService,
                private puzzleService: PuzzleService,
                private puzzleTypeService: PuzzleTypesService,
                private puzzleColorService: PuzzleColorsService,
                private router: Router,
                private activatedRoute: ActivatedRoute){
    }
    
    ngOnInit(): void {
        this.activatedRouteSubscription1 = this.activatedRoute.paramMap.subscribe(params => {
            this.puzzleId = +params.get('id');
            console.log(this.puzzleId);
            this.loadDataFromApi();
        });
        this.activatedRouteSubscription2 = this.activatedRoute.queryParams.subscribe(params => {
            this.queryParam = params['puzzletype'];
            console.log(this.queryParam);
        });

        this.subscriptions.push(this.activatedRouteSubscription1);
        this.subscriptions.push(this.activatedRouteSubscription2);
    }
    
    ngAfterViewInit(): void {
    }

    loadDataFromApi(): void{
        this.lookupService.getPuzzle(this.puzzleId)
            .subscribe((p: PuzzleTableRowModel) => {
                this.puzzle = p;
                console.log(this.puzzle);
                this.subtotal = this.puzzle.price;
            });

        this.puzzleService.getPuzzle(this.puzzleId)
            .subscribe((pzl: PuzzleModel) => {
                this.puzzleTypeService.getByIdFriendly(pzl.puzzleTypeId)
                    .subscribe((pt : PuzzleTypeTableRowModel) => {
                        this.difficultyLevel = pt.difficultyLevel;
                    });
            });
        this.puzzleColorService.getAll()
            .subscribe((c : PuzzleColorModel[]) => {
                this.colors = c;
            });
    }

    navigateToCollections(): void{
        this.router.navigate(['/collections', this.puzzle.puzzleType]);
    }

    incrementQuantity(): void{
        if(this.quantity < 100){
            this.quantity++;
            this.subtotal += this.puzzle.price;
        }
    }

    decrementQuantity(): void{
        if(this.quantity > 1){
            this.quantity--;
            this.subtotal -= this.puzzle.price;
        }
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            if(s){
                s.unsubscribe();
            }
        });
    }
}