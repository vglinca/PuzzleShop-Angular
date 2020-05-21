import { Routes } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { StripePaymentComponent } from './components/stripe-payment/stripe-payment.component';
import { ConfirmOrderComponent } from './components/confirm-order/confirm-order.component';
import { PuzzleImagesResolver } from './resolvers/puzzle-images.resolver';
import { PuzzleDetailsResolver } from './resolvers/puzzle-details.resolver';
import { PersonalCabinetComponent } from './components/personal-cabinet/personal-cabinet.component';
import { UserInfoResolver } from './resolvers/user-info.resolver';

export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'collections', component: ProductsListComponent },
    { path: 'collections/:puzzleType', component: ProductsListComponent },
    { path: 'collections/:puzzleType/:id', component: ProductDetailsComponent, resolve: {images: PuzzleImagesResolver, puzzle: PuzzleDetailsResolver} },
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
    { path: 'checkout', component: ConfirmOrderComponent},
    { path: 'payment', component: StripePaymentComponent },
    { path: 'personal', component: PersonalCabinetComponent, resolve: {userInfo: UserInfoResolver}, canActivate: [AuthGuard]},
    { path: 'administration', loadChildren: () => import('./admin_module/admin.module').then(a => a.AdminModule), canActivate: [AdminAuthGuard]},
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: '**', component: NotFoundPageComponent }
];