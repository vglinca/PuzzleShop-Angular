import { Component, Inject, OnInit } from '@angular/core';
import { PuzzleLookupService } from 'src/app/services/lookup.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleModel } from 'src/app/models/roles/role.model';
import { UsersService } from 'src/app/services/users.service';
import { forkJoin } from 'rxjs';
import { UserWithRolesModel } from 'src/app/models/users/user-with-roles.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NotificationService } from 'src/app/services/notification.service';
import { AccountService } from 'src/app/services/account.service';
import { adminAuthorizeRole, moderatorAuthorizeRole, userAuthorizeRole } from 'src/app/common/consts/authorize-role';
import { errorMessage } from 'src/app/common/consts/generic-error-message';

@Component({
    templateUrl: './user-roles-dialog.component.html',
    styleUrls: ['./user-roles-dialog.component.scss']
})
export class UserRolesDialogComponent implements OnInit{

    roles: RoleModel[] = [];
    user: UserWithRolesModel;
    containsAdminRole: boolean = false;
    userRole: string = userAuthorizeRole;

    constructor(@Inject(MAT_DIALOG_DATA) public userId: number,
                private lookupService: PuzzleLookupService,
                private userService: UsersService,
                private notificationService: NotificationService,
                private dialogRef: MatDialogRef<UserRolesDialogComponent>){
    }

    ngOnInit(): void {
        this.loadDataFromApi();
    }

    onChange(event: MatCheckboxChange, roleId: number): void{
        let role: RoleModel = this.roles.filter(r => r.id === roleId)[0];
        role.isMatched = event.checked;
        console.log(this.roles);
    }

    onSubmit(): void{
        let roles: Array<string> = new Array<string>();
        this.roles.forEach(role => {
            if(role.isMatched){
                roles.push(role.name);
            }
        });
        this.userService.editRoles(this.user.id, roles)
            .subscribe(() => {
                this.notificationService.success('Changes applied.');
                this.dialogRef.close();
            }, err => {
                this.notificationService.warn(errorMessage);
            });
    }

    onCancel(): void{
        this.dialogRef.close();
    }

    private loadDataFromApi(): void{
        const roles = this.lookupService.getUserRoles();
        const user = this.userService.getUser(this.userId);

        forkJoin(roles, user)
            .subscribe(([r, u]) => {
                this.roles = r;
                this.user = u;
                if([...this.user.roles].find(r => r === adminAuthorizeRole || r === moderatorAuthorizeRole)){
                    this.containsAdminRole = true;
                }
                this.roles.forEach(role => {
                    if([...this.user.roles].find(r => r === role.name)){
                        role.isMatched = true;
                    }
                });
            }, err => console.log(err));
    }
}
