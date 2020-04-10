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
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { PuzzleLookupService } from './services/puzzle-lookup-service';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    UsersModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule
    ],
  declarations: [
      AppComponent,
      NavigationComponent,
      ProductsListComponent
    ],
  providers: [
    DatePipe,
    PuzzleLookupService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
