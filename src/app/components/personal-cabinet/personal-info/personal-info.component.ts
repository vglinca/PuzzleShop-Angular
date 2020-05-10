import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { UsersService } from 'src/app/services/users.service';
import { LoggedInUserInfo } from 'src/app/models/users/logged-in-user-info';
import { PlainUserModel } from 'src/app/models/users/plain-user.model';
import { UserForUpdateModel } from 'src/app/models/users/user-for-update.model';
import { NotificationService } from 'src/app/services/notification.service';
import { errorMessage } from 'src/app/common/consts/generic-error-message';
import { Subscription, concat } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'personal-info',
    templateUrl: './personal-info.component.html',
    styleUrls: ['./personal-info.component.scss']
})

export class PersonalInfoComponent implements OnInit, OnDestroy {

    userForm: FormGroup;
    minDate = new Date(1940, 0, 1);
    maxDate = new Date(2005, 11, 31);
    currentUser: LoggedInUserInfo;
    userModel: PlainUserModel;
    activatedRouteSubscription: Subscription;
    concatSubscription: Subscription;
    subscriptions: Subscription[] = [];

    constructor(private formBuilder: FormBuilder,
                private accountService: AccountService,
                private notificationService: NotificationService,
                private activatedRoute: ActivatedRoute,
                private datePipe: DatePipe,
                private userService: UsersService) {
                    this.currentUser = this.accountService.parseToken();
                    this.userForm = this.formBuilder.group({
                        firstName: [''],
                        lastName: [''],            
                        email: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
                        birthDate: ['']
                    });
                }

    ngOnInit(): void {
        this.activatedRouteSubscription = this.activatedRoute.data.subscribe((data: {userInfo: PlainUserModel}) => {
            this.userModel = data.userInfo;
            this.userForm.patchValue({...this.userModel});
        });
        this.subscriptions.push(this.activatedRouteSubscription);
    }

    onSaveChanges(): void{
        var dateOfBirth = this.datePipe.transform(this.userForm.value.birthDate, 'yyyy-MM-dd');
        let userForUpdate: UserForUpdateModel = {...this.userForm.value, birthDate: dateOfBirth};

        const update = this.userService.updateUserProfile(this.currentUser.userId, userForUpdate);
        const user = this.userService.getPlainUser(this.currentUser.userId);

        this.concatSubscription = concat(update, user)
            .subscribe((u: PlainUserModel) => {
                this.userModel = u;
                this.userForm.patchValue({...u});
                this.notificationService.success('Changes successfully applied.');
            }, err => this.notificationService.warn(errorMessage));
            
        this.subscriptions.push(this.concatSubscription);
    }

    ngOnDestroy(): void{
        this.subscriptions.forEach(s => {
            if(s){
                s.unsubscribe();
            }
        });
    }
}