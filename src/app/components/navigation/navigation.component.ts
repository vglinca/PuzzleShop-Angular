import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserLoginComponent } from '../../users_module/identity/user-login.component';
import { PuzzleLookupService } from '../../services/puzzle-lookup-service';
import { PuzzleTypeModel } from '../../models/puzzle-types/PuzzleTypeModel';
import { PuzzleModel } from '../../models/puzzles/PuzzleModel';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
    selector: 'nav-bar',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit{

    puzzleTypes: PuzzleTypeModel[];
    @Input() sidenav: MatSidenav;

    // rubicsCubes = ['2x2x2', '3x3x3', '4x4x4', '5x5x5'];

    constructor(private matDialog: MatDialog,
                private lookupService: PuzzleLookupService,
                private router: Router){}

    ngOnInit(): void {
        this.loadPuzzleTypesFromApi();
    }

    loginUser(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.height = "65%";
        dialogConfig.width = "30%";
        this.matDialog.open(UserLoginComponent, dialogConfig);
    }

    onClick(puzzleType){
        console.log('onclick' + puzzleType);
        this.router.navigate(['/rubics-cubes', puzzleType]);
    }

    private loadPuzzleTypesFromApi(){
        this.lookupService.getPuzzleTypes()
            .subscribe((pt: PuzzleTypeModel[]) => {
                this.puzzleTypes = pt;
            });
    }
}