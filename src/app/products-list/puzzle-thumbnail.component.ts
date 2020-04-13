import { Component, Input } from '@angular/core';
import { PuzzleModel } from '../models/puzzles/PuzzleModel';

@Component({
    selector: 'puzzle-thumbnail',
    templateUrl: './puzzle-thumbnail.component.html',
    styleUrls: ['puzzle-thumbnail.component.css']
})
export class PuzzleThumbnailComponent{
    @Input() puzzle: PuzzleModel;
}