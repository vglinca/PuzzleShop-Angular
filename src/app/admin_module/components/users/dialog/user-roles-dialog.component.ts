import { Component, Inject, OnInit } from '@angular/core';
import { PuzzleLookupService } from 'src/app/services/puzzle-lookup-service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleModel } from 'src/app/models/roles/role.model';
import { UsersService } from 'src/app/services/users.service';
import { forkJoin } from 'rxjs';
import { UserWithRolesModel } from 'src/app/models/users/user-with-roles.model';

@Component({
    templateUrl: './user-roles-dialog.component.html',
    styleUrls: ['./user-roles-dialog.component.scss']
})
export class UserRolesDialogComponent implements OnInit{

    roles: RoleModel[] = [];
    user: UserWithRolesModel;

    constructor(@Inject(MAT_DIALOG_DATA) public userId: number,
                private lookupService: PuzzleLookupService,
                private userService: UsersService){

    }

    ngOnInit(): void {
        this.loadDataFromApi();
    }

    private loadDataFromApi(): void{
        const roles = this.lookupService.getUserRoles();
        const user = this.userService.getUser(this.userId);

        forkJoin(roles, user)
            .subscribe(([r, u]) => {
                this.roles = r;
                this.user = u;
            }, err => console.log(err));
    }
}