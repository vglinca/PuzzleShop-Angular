import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';


@Component({
    templateUrl: './add-to-cart-dialog.component.html',
    styleUrls: ['./add-to-cart-dialog.component.scss']
})
export class AddToCartDialogComponent implements OnInit{

    staticFilesUrl: string = environment.staticFilesUrl;
    puzzleName: string;
    puzzleColor: string;
    imageLink: string;

    constructor(@Inject(MAT_DIALOG_DATA) private puzzleData: any){
    }
    ngOnInit(): void {
        this.puzzleName = this.puzzleData.puzzleName;
        this.puzzleColor = this.puzzleData.puzzleColor;
        this.imageLink = this.staticFilesUrl + this.puzzleData.imageLink;
    }
}