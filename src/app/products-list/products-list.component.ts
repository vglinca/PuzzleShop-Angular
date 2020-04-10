import { Component, OnInit } from '@angular/core';
import { PuzzleTypeModel } from '../models/puzzle-types/PuzzleTypeModel';
import { ManufacturerModel } from '../models/manufacturers/ManufacturerModel';
import { PuzzleLookupService } from '../services/puzzle-lookup-service';
import { PuzzleColorModel } from '../models/puzzle-colors/PuzzleColorModel';


@Component({
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component..css']
})
export class ProductsListComponent implements OnInit{

    puzzleTypes: PuzzleTypeModel[];
    manufacturers: ManufacturerModel[];
    puzzleColors: PuzzleColorModel[];

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
    }
}