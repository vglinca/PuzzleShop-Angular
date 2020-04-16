import { ImageModel } from 'src/app/models/images/ImageModel';
import { ImageForCreationModel } from '../images/image-for-creation.model';

export interface PuzzleForCreationModel{
    name: string;
    description: string;
    price: string;
    isWcaPuzzle: string;
    weight: string;
    manufacturerId: string;
    puzzleTypeId: string;
    colorId: string;
    difficultyLevelId: string;
    materialTypeId: string;
    images: ImageForCreationModel[];
}