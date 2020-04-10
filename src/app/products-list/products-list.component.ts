import { Component, OnInit } from '@angular/core';
import { PuzzleTypeModel } from '../models/puzzle-types/PuzzleTypeModel';
import { ManufacturerModel } from '../models/manufacturers/ManufacturerModel';
import { PuzzleLookupService } from '../services/puzzle-lookup-service';
import { PuzzleColorModel } from '../models/puzzle-colors/PuzzleColorModel';
import { PagedResponse } from '../models/1pagination/paged-response';
import { PuzzleModel } from '../models/puzzles/PuzzleModel';
import { PagedRequest } from '../models/1pagination/paged-request';
import { RequestFilters } from '../models/1pagination/request-filters';
import { LogicalOperator } from '../models/1pagination/logical-operator';


@Component({
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component..css']
})
export class ProductsListComponent implements OnInit{

    puzzleTypes: PuzzleTypeModel[];
    manufacturers: ManufacturerModel[];
    puzzleColors: PuzzleColorModel[];
    pagedPuzzles: PagedResponse<PuzzleModel>;
    puzzles: PuzzleModel[];

    requestFilters: RequestFilters;

    constructor(private lookupService: PuzzleLookupService){}
   
    ngOnInit(): void {
        this.lookupService.getPuzzleTypes()
            .subscribe((pt: PuzzleTypeModel[]) => {
                this.puzzleTypes = pt;
                console.log(this.puzzleTypes);
            });
        
        this.lookupService.getManufacturers()
            .subscribe((m: ManufacturerModel[]) => this.manufacturers = m);

        this.lookupService.getPuzzleColors()
            .subscribe((c: PuzzleColorModel[]) => this.puzzleColors = c);

        this.getPuzzles();
    }

    private getPuzzles(){
        this.requestFilters = {operator: LogicalOperator.AND, filters: []}
        const pagedRequest = new PagedRequest(1, 15, this.requestFilters);
        this.lookupService.getPuzzles(pagedRequest)
            .subscribe((pagedPuzzles: PagedResponse<PuzzleModel>) => {
                this.puzzles = pagedPuzzles.items;
                //this.pagedPuzzles = pagedPuzzles;
                console.log(this.puzzles);
            });
    }
}