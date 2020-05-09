import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PuzzleTableRowModel } from '../models/puzzles/puzzle-table-row.model';
import { PuzzleLookupService } from '../services/lookup.service';
import { PuzzleService } from '../services/puzzle.service';

@Injectable({ 
    providedIn: 'root' 
})
export class PuzzleDetailsResolver implements Resolve<PuzzleTableRowModel> {

    constructor(private puzzleService: PuzzleService){}
    resolve(route: ActivatedRouteSnapshot): Observable<PuzzleTableRowModel> | Promise<PuzzleTableRowModel> | PuzzleTableRowModel {
        let puzzleId: number = +route.params.id;
        return this.puzzleService.getPuzzleFriendly(puzzleId);
    }
}