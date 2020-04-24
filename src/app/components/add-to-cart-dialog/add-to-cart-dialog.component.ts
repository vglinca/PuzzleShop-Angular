import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Component({
    templateUrl: './add-to-cart-dialog.component.html',
    styleUrls: ['./add-to-cart-dialog.component.scss']
})
export class AddToCartDialogComponent implements OnInit{

    staticFilesUrl: string = environment.staticFilesUrl;
    puzzleName: string;
    puzzleColor: string;
    puzzleType: string;
    imageLink: string;

    constructor(@Inject(MAT_DIALOG_DATA) private puzzleData: any,
                private router: Router,
                private dialogRef: MatDialogRef<AddToCartDialogComponent>){
    }
    ngOnInit(): void {
        this.puzzleName = this.puzzleData.puzzleName;
        this.puzzleColor = this.puzzleData.puzzleColor;
        this.puzzleType = this.puzzleData.puzzleType;
        this.imageLink = this.staticFilesUrl + this.puzzleData.imageLink;
    }

    onContinueShoppingClick(): void{
        this.router.navigate(['/collections', this.puzzleType]);
        this.dialogRef.close();
    }

    onGoToCartClick(): void{
        this.router.navigate(['/cart']);
        this.dialogRef.close();
    }
}