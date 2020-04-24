import { ImageModel } from '../images/image.model';

export class PuzzleTableRowModel{

    id: number;
    name: string;
    description: string;
    price: number;
    isMagnetic: boolean;
    weight: number;
    manufacturer: string;
    puzzleType: string;
    color: string;
    materialType: string;
    rating: number;
    availableInStock: number;
    images: ImageModel[];

    constructor(){
        this.images = [];
    }
}