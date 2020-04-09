import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { NavigationComponent } from './navigation/navigation.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { UsersModule } from './users/users.module';
import { JQ_TOKEN } from './services/jquery.provider';

let jQuery = window['$'];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    UsersModule,
    RouterModule.forRoot(appRoutes)
    ],
  declarations: [
      AppComponent,
      NavigationComponent,
      ProductsListComponent
    ],
  providers: [
    { provide: JQ_TOKEN, useValue: jQuery },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
