import { ImageModel } from '../images/image.model';

export interface PuzzleModel{

    id: number;
    name: string;
    description: string;
    price: number;
    isMagnetic: boolean;
    weight: number;
    manufacturerId: number;
    puzzleTypeId: number;
    colorId: number;
    materialTypeId: number;
    rating: number;
    availableInStock: number;
    images: ImageModel[];
}