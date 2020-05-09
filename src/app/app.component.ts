import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UserLoginComponent } from './components/account/auth/user-login.component';
import { AccountService } from './services/account.service';
import { environment } from 'src/environments/environment';
import { NotificationService } from './services/notification.service';
import { Subscription } from 'rxjs';
import { LoggedInUserInfo } from './models/users/logged-in-user-info';
import { ConfirmDialogService } from './common/confirm_dialog/confirm-dialog.service';
import { PuzzleTypeModel } from './models/puzzle-types/puzzle-type.model';
import { PuzzleLookupService } from './services/lookup.service';
import { Router } from '@angular/router';
import { UserRegistrationComponent } from './components/account/registration/user-registration.component';
import { PuzzleTypesService } from './services/puzzle-types.service';
import { PuzzleTypeTableRowModel } from './models/puzzle-types/puzzle-type-table-row.model';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
	title = 'puzzleshop-client';

	puzzleTypes: PuzzleTypeTableRowModel[] = [];
	rcPuzzles: PuzzleTypeTableRowModel[] = [];
	wcaPuzzles: PuzzleTypeTableRowModel[] = [];

	
	dialogRefSubscription: Subscription;
	dialogRefSubscription1: Subscription;
	subscriptions: Subscription[] = [];

	public get isLoggedIn(): boolean {
		return this.accountService.isAuthenticated();
	}

	public get isInAdminRole(): boolean {
		return this.accountService.isInAdminRole();
	}


	constructor(private accountService: AccountService, 
				private router: Router,
				private dialogService: ConfirmDialogService,
				private notificationService: NotificationService,
				private puzzleTypeService: PuzzleTypesService,
				private matDialog: MatDialog) {
	}

	ngOnInit(): void {
		this.loadPuzzleTypesFromApi();
	}

	onClick = (puzzleType: string) => this.router.navigate(['/collections', puzzleType]);

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

	onCreateAccountClick(): void {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.autoFocus = false;
		dialogConfig.height = "85%";
		dialogConfig.width = "35%";
		this.matDialog.open(UserRegistrationComponent, dialogConfig);
	}

	private loadPuzzleTypesFromApi() {
		this.puzzleTypeService.getAll()
			.subscribe((pt: PuzzleTypeTableRowModel[]) => {
				this.puzzleTypes = pt;
				this.rcPuzzles = this.puzzleTypes
					.filter(pt => pt.isRubicsCube == true && pt.isWca == true)
					.sort(this.sortAsc);
				this.wcaPuzzles = this.puzzleTypes
					.filter(pt => pt.isWca == true)
					.sort(this.sortAsc);
			});
	}

	private sortAsc(a: PuzzleTypeTableRowModel, b: PuzzleTypeTableRowModel) {
		return (a.title > b.title) ? 1 : (a.title < b.title ? -1 : 0);
	}

	ngAfterViewInit(): void {
	}

	ngOnDestroy(): void{
		this.subscriptions.forEach(s => {
			if (s) {
				s.unsubscribe();
			}
		});
	}
}
