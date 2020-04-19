import { Component, Input, AfterViewInit, OnInit } from '@angular/core';
import { PuzzleModel } from '../../models/puzzles/puzzle.model';
import { PuzzleTableRowModel } from 'src/app/models/puzzles/puzzle-table-row.model';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'puzzle-thumbnail',
    templateUrl: './puzzle-thumbnail.component.html',
    styleUrls: ['puzzle-thumbnail.component.css']
})
export class PuzzleThumbnailComponent implements AfterViewInit, OnInit{
   
    baseStaticFilesUrl: string = environment.staticFilesUrl;
    @Input() puzzle: PuzzleTableRowModel = new PuzzleTableRowModel();
    // @Input() imageLink: string;

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
    }
}