import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material_module/material.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app-routes';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { PuzzleLookupService } from './services/puzzle-lookup-service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PuzzleThumbnailComponent } from './components/puzzle-thumbnail/puzzle-thumbnail.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CarouselItemDirective } from './common/carousel/carousel-item.directive';
import { CarouselComponent } from './common/carousel/carousel.component';
import { ImageItemElement } from './admin_module/components/puzzles/create-edit/create-edit-puzzle.component';
import { CarouselItemElement } from './common/carousel/carousel-item-element.directive';
import { UserRegistrationComponent } from './components/account/registration/user-registration.component';
import { UserLoginComponent } from './components/account/auth/user-login.component';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from './common/confirm_dialog/confirm-dialog.component';
import { NotFoundPageComponent } from './common/not_found_page/not-found-page.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { AddToCartDialogComponent } from './components/add-to-cart-dialog/add-to-cart-dialog.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { StripePaymentComponent } from './components/payment/stripe-payment.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ProductsListComponent,
    PuzzleThumbnailComponent,
    ProductDetailsComponent,
    
    CarouselComponent, 
    CarouselItemDirective, 
    CarouselItemElement,

    ImageItemElement,

    UserRegistrationComponent,
    UserLoginComponent,
    HomeComponent,
    AddToCartDialogComponent,
    CartComponent,
    StripePaymentComponent,

    NotFoundPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem(environment.accessToken),
        whitelistedDomains: [environment.whitelistedDomains],
        blacklistedRoutes: [environment.blacklistedRoutes]
      }})
    ],
  providers: [
    DatePipe,
    PuzzleLookupService,
    AuthGuard,
    AdminAuthGuard
  ],
  entryComponents: [
    UserRegistrationComponent,
    UserLoginComponent,
    ConfirmDialogComponent,
    AddToCartDialogComponent,
    StripePaymentComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
