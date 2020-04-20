import { Routes } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

export const appRoutes: Routes = [
    { path: 'collections/:puzzleType', component: ProductsListComponent },
    { path: 'collections/:puzzleType/:id', component: ProductDetailsComponent },
    // { path: 'wca-puzzles', component: ProductsListComponent},
    { path: 'administration', loadChildren: () => import('./admin_module/admin.module').then(a => a.AdminModule)},
    { path: 'user', loadChildren: () => import('./users_module/users.module').then(u => u.UsersModule) }
];