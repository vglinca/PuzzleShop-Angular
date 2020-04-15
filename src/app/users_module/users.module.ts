import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRegistrationComponent } from './identity/user-registration.component';
import { RouterModule } from '@angular/router';
import { userRoutes } from './user.routes';
import { MaterialModule } from '../material_module/material.module';
import { UserLoginComponent } from './identity/user-login.component';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(userRoutes),
    ],
    declarations: [
        UserRegistrationComponent,
        UserLoginComponent
        
    ],
    providers:[],
    entryComponents:[UserLoginComponent, UserRegistrationComponent]
})
export class UsersModule{
}