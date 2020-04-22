import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UserLoginComponent } from './components/account/auth/user-login.component';
import { AccountService } from './services/account.service';
import { environment } from 'src/environments/environment';
import { NotificationService } from './services/notification.service';
import { Subscription } from 'rxjs';
import { LoggedInUserInfo } from './models/users/logged-in-user-info';
import { ConfirmDialogService } from './common/confirm_dialog/confirm-dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
  title = 'puzzleshop-client';
  items = [
    { title: 'Slide 1' },
    { title: 'Slide 2' },
    { title: 'Slide 3' },
  ]

  dialogRefSubscription: Subscription;
  dialogRefSubscription1: Subscription;
  subscriptions: Subscription[] = [];

  public get accountInfo(): LoggedInUserInfo{
    return this.accountService.parseToken();
  }

  public get isLoggedIn(): boolean {
    return this.accountService.isAuthenticated();
  }

  constructor(private matDialog: MatDialog,
    private accountService: AccountService,
    private dialogService: ConfirmDialogService,
    private notificationService: NotificationService) {
  }

  onSignInClick(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = false;
    dialogConfig.height = "70%";
    dialogConfig.width = "30%";
    const dialogRef: MatDialogRef<UserLoginComponent> = this.matDialog.open(UserLoginComponent, dialogConfig);
    this.dialogRefSubscription = dialogRef.afterClosed().subscribe(() => {
      console.log('After closed.');
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
          }, err => console.log(err));
      }
    });
    this.subscriptions.push(this.dialogRefSubscription1);

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => {
      if(s){
        s.unsubscribe();
      }
    });
  }
}
