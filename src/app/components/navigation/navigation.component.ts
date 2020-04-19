import { Component, OnInit, Input, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserLoginComponent } from '../../users_module/identity/user-login.component';
import { PuzzleLookupService } from '../../services/puzzle-lookup-service';
import { PuzzleTypeModel } from '../../models/puzzle-types/puzzle-type.model';
import { PuzzleModel } from '../../models/puzzles/puzzle.model';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
    selector: 'nav-bar',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, AfterViewInit{

    puzzleTypes: PuzzleTypeModel[] = [];
    rcPuzzles: PuzzleTypeModel[] = [];
    wcaPuzzles: PuzzleTypeModel[] = [];
    @Input() sidenav: MatSidenav;
    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;


    constructor(private matDialog: MatDialog,
                private lookupService: PuzzleLookupService,
                private router: Router){}

    ngAfterViewInit(): void {
    }

    ngOnInit(): void {
        this.loadPuzzleTypesFromApi();
        
    }

    openMenu(i: number){
        this.triggers.toArray()[i].openMenu();
    }

    closeMenu(i: number){
        this.triggers.toArray()[i].closeMenu();
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
                this.rcPuzzles = this.puzzleTypes
                    .filter(pt => pt.isRubicsCube == true && pt.isWca == true)
                    .sort(this.sortAsc);
                console.log(this.rcPuzzles);
                this.wcaPuzzles = this.puzzleTypes
                    .filter(pt => pt.isWca == true)
                    .sort(this.sortAsc);
            });
    }

    private sortAsc(a: PuzzleTypeModel, b: PuzzleTypeModel){
       return (a.title > b.title) ? 1 : (a.title < b.title ? -1 : 0);
    }
}