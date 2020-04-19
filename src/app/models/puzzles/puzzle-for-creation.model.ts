import { ImageModel } from 'src/app/models/images/image.model';
import { ImageForCreationModel } from '../images/image-for-creation.model';

export interface PuzzleForCreationModel{
    name: string;
    description: string;
    price: string;
    isMagnetic: string;
    weight: string;
    manufacturerId: string;
    puzzleTypeId: string;
    colorId: string;
    materialTypeId: string;
    images: ImageForCreationModel[];
}