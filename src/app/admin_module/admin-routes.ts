import { Routes } from '@angular/router';
import { ManufacturersComponent } from './components/manufacturers/manufacturers-list.component';
import { CreateEditManufacturerComponent } from './components/manufacturers/create-edit/create-edit-manufacturer.component';
import { PuzzleTypesComponent } from './components/puzzle_types/puzzle-types-list.component';
import { PuzzleColorsComponent } from './components/puzzle_colors/puzzle-colors-list.component';
import { PuzzlesComponent } from './components/puzzles/puzzles-list.component';
import { CreateEditPuzzleComponent } from './components/puzzles/create-edit/create-edit-puzzle.component';
import { UsersListComponent } from './components/users/users-list.component';
import { OrdersListComponent } from './components/orders/orders-list.component';

export const adminRoutes: Routes = [
    { path: '', children: [
        {
            path: '', children: [
                { path: 'manufacturers', component: ManufacturersComponent},
                { path: 'manufacturers/add', component: CreateEditManufacturerComponent },
                { path: 'puzzletypes', component: PuzzleTypesComponent },
                { path: 'puzzlecolors', component: PuzzleColorsComponent },
                { path: 'puzzles', component: PuzzlesComponent },
                { path: 'puzzles/edit/:id', component: CreateEditPuzzleComponent },
                { path: 'puzzles/create/:id', component: CreateEditPuzzleComponent },
                { path: 'users', component: UsersListComponent },
                { path: 'orders', component: OrdersListComponent }
            ]
        }
    ]}
];