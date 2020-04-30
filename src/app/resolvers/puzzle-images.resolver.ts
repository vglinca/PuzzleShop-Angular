import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ImageModel } from '../models/images/image.model';
import { ImagesService } from '../services/images.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PuzzleImagesResolver implements Resolve<ImageModel[]>{

    constructor(private imageService: ImagesService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ImageModel[] | Observable<ImageModel[]> | Promise<ImageModel[]> {
        let puzzleId: number = +route.params.id;
        return this.imageService.getImagesByPuzzle(puzzleId);
    }
}