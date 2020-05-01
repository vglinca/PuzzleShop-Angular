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
            new ImageItem({src: '../../assets/images/gallery/3a5c6dda0215c51e9dab900ea72dfd22.jpg', thumb: '../../assets/images/gallery/3a5c6dda0215c51e9dab900ea72dfd22.jpg'}),
            new ImageItem({src: '../../assets/images/gallery/9cea7eeb070d42db7bbe8e58a14feeed.jpg', thumb: '../../assets/images/gallery/9cea7eeb070d42db7bbe8e58a14feeed.jpg'}),
            new ImageItem({src: '../../assets/images/gallery/46590b58e4d09c59acf749fe71b9372e.jpg', thumb: '../../assets/images/gallery/46590b58e4d09c59acf749fe71b9372e.jpg'}),
            new ImageItem({src: '../../assets/images/gallery/76929ecb38d160ef10c19ee4717aba45.jpg', thumb: '../../assets/images/gallery/76929ecb38d160ef10c19ee4717aba45.jpg'}),
            new ImageItem({src: '../../assets/images/gallery/04592063346af5ef70d9a55818b6360b.jpg', thumb: '../../assets/images/gallery/04592063346af5ef70d9a55818b6360b.jpg'}),
            new ImageItem({src: '../../assets/images/gallery/tengyunv2mbanner_62955ee6-fbd6-4c28-b8e8-437065d26ec6_1512x.jpg', thumb: '../../assets/images/gallery/tengyunv2mbanner_62955ee6-fbd6-4c28-b8e8-437065d26ec6_1512x.jpg'})
        ];
    }
}