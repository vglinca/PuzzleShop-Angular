import { Component } from '@angular/core';

@Component({
    selector: 'nav-bar',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent{

    rubicsCubes = ['2x2x2', '3x3x3', '4x4x4', '5x5x5'];

    constructor(){}
}