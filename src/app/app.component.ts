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
import { PuzzleLookupService } from './services/puzzle-lookup.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {
	title = 'puzzleshop-client';

	puzzleTypes: PuzzleTypeModel[] = [];
	rcPuzzles: PuzzleTypeModel[] = [];
	wcaPuzzles: PuzzleTypeModel[] = [];

	public get isLoggedIn(): boolean {
		return this.accountService.isAuthenticated();
	}

	public get isInAdminRole(): boolean {
		return this.accountService.isInAdminRole();
	}


	constructor(private accountService: AccountService, 
				private router: Router,
				private lookupService: PuzzleLookupService) {
	}

	ngOnInit(): void {
		this.loadPuzzleTypesFromApi();
	}

	onClick = (puzzleType: string) => this.router.navigate(['/collections', puzzleType]);

	private loadPuzzleTypesFromApi() {
		this.lookupService.getPuzzleTypes()
			.subscribe((pt: PuzzleTypeModel[]) => {
				this.puzzleTypes = pt;
				this.rcPuzzles = this.puzzleTypes
					.filter(pt => pt.isRubicsCube == true && pt.isWca == true)
					.sort(this.sortAsc);
				this.wcaPuzzles = this.puzzleTypes
					.filter(pt => pt.isWca == true)
					.sort(this.sortAsc);
			});
	}

	private sortAsc(a: PuzzleTypeModel, b: PuzzleTypeModel) {
		return (a.title > b.title) ? 1 : (a.title < b.title ? -1 : 0);
	}

	ngAfterViewInit(): void {
	}


}
