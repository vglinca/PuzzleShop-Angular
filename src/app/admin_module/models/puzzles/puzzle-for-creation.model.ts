import { ImageModel } from 'src/app/models/images/ImageModel';

export interface PuzzleForCreationModel{
    name: string;
    description: string;
    price: number;
    isWcaPuzzle: boolean;
    weight: number;
    manufacturerId: number;
    puzzleTypeId: number;
    colorId: number;
    difficultyLevelId: number;
    materialTypeId: number;
    images: ImageModel[];
}