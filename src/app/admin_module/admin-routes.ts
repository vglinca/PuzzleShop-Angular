import { Routes } from '@angular/router';
import { ManufacturersComponent } from './components/manufacturers/manufacturers.component';
import { CreateEditManufacturerComponent } from './components/manufacturers/create-edit-manufacturer.component';
import { PuzzleTypesComponent } from './components/puzzle_types/puzzle-types.component';
import { PuzzleColorsComponent } from './components/puzzle_colors/puzzle-colors.component';
import { PuzzlesComponent } from './components/puzzles/puzzles.component';

export const adminRoutes: Routes = [
    { path: '', children: [
        {
            path: '', children: [
                { path: 'manufacturers', component: ManufacturersComponent},
                { path: 'manufacturers/add', component: CreateEditManufacturerComponent },
                { path: 'puzzletypes', component: PuzzleTypesComponent },
                { path: 'puzzlecolors', component: PuzzleColorsComponent },
                { path: 'puzzles', component: PuzzlesComponent }
            ]
        }
    ] }
];