import { Component, OnInit } from '@angular/core';
import { GalleryItem, ImageItem } from '@ngx-gallery/core';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
    images: GalleryItem[];

    constructor(){}

    ngOnInit(): void {
        this.images = [
            new ImageItem({src: '../../assets/images/3x3-cubeorithms-thunderclap-v3-magnetic-3x3-2_1024x1024.jpg', thumb: '../../assets/images/3x3-cubeorithms-thunderclap-v3-magnetic-3x3-2_1024x1024.jpg'}),
            new ImageItem({src: '../../assets/images/3x3-dayan-guhong-v3-magnetic-3x3-1_1024x1024.jpg', thumb: '../../assets/images/3x3-dayan-guhong-v3-magnetic-3x3-1_1024x1024.jpg'}),
            new ImageItem({src: '../../assets/images/CubeSolveHero_Valk_3_Elite_Magnetic_3x3.jpg', thumb: '../../assets/images/CubeSolveHero_Valk_3_Elite_Magnetic_3x3.jpg'}),
            new ImageItem({src: '../../assets/images/ganx.jpg', thumb: '../../assets/images/ganx.jpg'}),
            new ImageItem({src: '../../assets/images/moYuWeilonggts3m.jpg', thumb: '../../assets/images/moYuWeilonggts3m.jpg'})
        ];
    }
}