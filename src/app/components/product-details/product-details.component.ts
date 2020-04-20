import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { PuzzleLookupService } from 'src/app/services/puzzle-lookup-service';
import { PuzzleTableRowModel } from 'src/app/models/puzzles/puzzle-table-row.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { DifficultyLevelModel } from 'src/app/models/difficulty-levels/difficulty-level.model';
import { PuzzleModel } from 'src/app/models/puzzles/puzzle.model';
import { PuzzleTypesService } from 'src/app/services/puzzle-types.service';
import { PuzzleTypeModel } from 'src/app/models/puzzle-types/puzzle-type.model';
import { PuzzleTypeTableRowModel } from 'src/app/models/puzzle-types/puzzle-type-table-row.model';


@Component({
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit, OnDestroy{

    puzzle: PuzzleTableRowModel;
    difficultyLevel: string;
    puzzleId: number;

    activatedRouteSubscription: Subscription;
    subscriptions: Subscription[] = [];

    constructor(private lookupService: PuzzleLookupService,
                private puzzleService: PuzzleService,
                private puzzleTypeService: PuzzleTypesService,
                private router: Router,
                private activatedRoute: ActivatedRoute){
    }
    
    ngOnInit(): void {
        this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(params => {
            this.puzzleId = +params.get('id');
            console.log(this.puzzleId);
            this.getPuzzle();
        });

        this.subscriptions.push(this.activatedRouteSubscription);
    }
    
    ngAfterViewInit(): void {
    }

    getPuzzle(): void{
        this.lookupService.getPuzzle(this.puzzleId)
            .subscribe((p: PuzzleTableRowModel) => {
                this.puzzle = p;
                console.log(this.puzzle);
            });

        this.puzzleService.getPuzzle(this.puzzleId)
            .subscribe((pzl: PuzzleModel) => {
                this.puzzleTypeService.getByIdFriendly(pzl.puzzleTypeId)
                    .subscribe((pt : PuzzleTypeTableRowModel) => {
                        this.difficultyLevel = pt.difficultyLevel;
                    });
            });
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            if(s){
                s.unsubscribe();
            }
        });
    }
}