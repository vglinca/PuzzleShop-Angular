import { Component, OnInit, Input, ViewChildren, QueryList, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UserLoginComponent } from '../account/auth/user-login.component';
import { PuzzleLookupService } from '../../services/puzzle-lookup-service';
import { PuzzleTypeModel } from '../../models/puzzle-types/puzzle-type.model';
import { PuzzleModel } from '../../models/puzzles/puzzle.model';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatMenuTrigger } from '@angular/material/menu';
import { AccountService } from 'src/app/services/account.service';
import { LoggedInUserInfo } from 'src/app/models/users/logged-in-user-info';
import { ConfirmDialogService } from 'src/app/common/confirm_dialog/confirm-dialog.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'nav-bar',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, AfterViewInit, OnDestroy{

    puzzleTypes: PuzzleTypeModel[] = [];
    rcPuzzles: PuzzleTypeModel[] = [];
    wcaPuzzles: PuzzleTypeModel[] = [];

    dialogRefSubscription: Subscription;
  dialogRefSubscription1: Subscription;
  subscriptions: Subscription[] = [];
    @Input() sidenav: MatSidenav;
    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;

    public get isInAdminRole(): boolean {
        return this.accountService.isInAdminRole();
    }

    public get isLoggedIn(): boolean {
        return this.accountService.isAuthenticated();
    }

    public get accountInfo(): LoggedInUserInfo{
        return this.accountService.parseToken();
      }
    
    constructor(private matDialog: MatDialog,
                private lookupService: PuzzleLookupService,
                private accountService: AccountService,
                private router: Router,
                private dialogService: ConfirmDialogService,
                private notificationService: NotificationService){}
    
    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            if(s){
              s.unsubscribe();
            }
          });
    }

    ngAfterViewInit(): void {
    }

    ngOnInit(): void {
        //this.isInAdminRole = this.accountService.isInAdminRole();
        this.loadPuzzleTypesFromApi();
    }

    onSignInClick(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = false;
        dialogConfig.height = "70%";
        dialogConfig.width = "30%";
        const dialogRef: MatDialogRef<UserLoginComponent> = this.matDialog.open(UserLoginComponent, dialogConfig);
        this.dialogRefSubscription = dialogRef.afterClosed().subscribe(() => {
          this.ngOnInit();
        });
        this.subscriptions.push(this.dialogRefSubscription);
      }
    
      onSignOutClick(): void {
        const dialogRef = this.dialogService.openConfirmDialog('Do You really wish to logout?');
        this.dialogRefSubscription1 = dialogRef.afterClosed().subscribe(action => {
          if (action === dialogRef.componentInstance.ACTION_CONFIRM) {
            this.accountService.logout()
              .subscribe(() => {
                localStorage.removeItem(environment.accessToken);
                this.notificationService.success('Logged off.');
                this.ngOnInit();
                this.router.navigate(['home']);
              }, err => console.log(err));
          }
        });
        this.subscriptions.push(this.dialogRefSubscription1);
    
      }

    openMenu(i: number){
        this.triggers.toArray()[i].openMenu();
    }

    closeMenu(i: number){
        this.triggers.toArray()[i].closeMenu();
    }

    onClick(puzzleType: string){
        this.router.navigate(['/collections', puzzleType]);
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