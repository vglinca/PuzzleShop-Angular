import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { PuzzleLookupService } from 'src/app/services/puzzle-lookup-service';
import { PuzzleTableRowModel } from 'src/app/models/puzzles/puzzle-table-row.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit, OnDestroy{

    puzzle: PuzzleTableRowModel;
    puzzleId: number;

    activatedRouteSubscription: Subscription;
    subscriptions: Subscription[] = [];

    constructor(private lookupService: PuzzleLookupService,
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