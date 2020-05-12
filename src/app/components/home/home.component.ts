import { Component, OnInit } from '@angular/core';
import { GalleryItem, ImageItem } from '@ngx-gallery/core';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { PagedResponse } from 'src/app/infrastructure/pagination/paged-response';
import { PuzzleTableRowModel } from 'src/app/models/puzzles/puzzle-table-row.model';
import { RequestFilters } from 'src/app/infrastructure/pagination/request-filters';
import { Filter } from 'src/app/infrastructure/pagination/filter';
import { PagedRequest } from 'src/app/infrastructure/pagination/paged-request';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

    images: GalleryItem[];
    staticFilesUrl: string = environment.staticFilesUrl;
    puzzlesPaged: PagedResponse<PuzzleTableRowModel>;
    requestFilters: RequestFilters;

    ratingArr: number[] = [];
    starCount: number = 5;

    constructor(private puzzleService: PuzzleService,
                private router: Router){}

    ngOnInit(): void {
        for(let i = 0; i < this.starCount; i++){
            this.ratingArr.push(i);
        }
        this.images = [
            new ImageItem({src: '../../assets/images/gallery/3a5c6dda0215c51e9dab900ea72dfd22.jpg', thumb: '../../assets/images/gallery/3a5c6dda0215c51e9dab900ea72dfd22.jpg'}),
            new ImageItem({src: '../../assets/images/gallery/9cea7eeb070d42db7bbe8e58a14feeed.jpg', thumb: '../../assets/images/gallery/9cea7eeb070d42db7bbe8e58a14feeed.jpg'}),
            new ImageItem({src: '../../assets/images/gallery/46590b58e4d09c59acf749fe71b9372e.jpg', thumb: '../../assets/images/gallery/46590b58e4d09c59acf749fe71b9372e.jpg'}),
            new ImageItem({src: '../../assets/images/gallery/76929ecb38d160ef10c19ee4717aba45.jpg', thumb: '../../assets/images/gallery/76929ecb38d160ef10c19ee4717aba45.jpg'}),
            new ImageItem({src: '../../assets/images/gallery/04592063346af5ef70d9a55818b6360b.jpg', thumb: '../../assets/images/gallery/04592063346af5ef70d9a55818b6360b.jpg'})
        ];
        this.loadPuzzlesFromApi();
    }

    showStarUsingRating(index: number, rating: number): string{
        if (rating >= index + 1 && (rating - index - 1) >= 0.8) {
			return 'star';
        }else if(rating >= index + 1 && (rating - index - 1) < 0.8){
            return 'star_half';
        }else {
			return 'star_border';
		}
    }

    loadPuzzlesFromApi(pageNumber: number = 0): void{
        var filters: Filter[] = [];
        const pagedRequest: PagedRequest = new PagedRequest('rating', 'desc', pageNumber, 8, this.requestFilters);
        this.puzzleService.getAllPuzzles(pagedRequest)
            .subscribe((resp) => {
                this.puzzlesPaged = resp;
            }, err => console.log(err));
    }

    openProductDetails(id: number, puzzleType: string): void{
        this.router.navigate(['/collections', puzzleType, id], 
            {queryParams: {puzzleType}});
    }
}