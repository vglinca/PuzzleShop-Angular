import { Routes } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NotFoundPageComponent } from './common/not_found_page/not-found-page.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
    { path: 'collections/:puzzleType', component: ProductsListComponent },
    { path: 'collections/:puzzleType/:id', component: ProductDetailsComponent },
    { path: 'administration', loadChildren: () => import('./admin_module/admin.module').then(a => a.AdminModule), canActivate: [AuthGuard]},
    // { path: '', component: AppComponent },
    // { path: '**', component: NotFoundPageComponent }
];