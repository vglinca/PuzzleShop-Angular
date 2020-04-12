import { ImageModel } from '../images/ImageModel';

export interface PuzzleModel{

    id: number;
    name: string;
    description: string;
    price: number;
    isWcaPuzzle: boolean;
    weight: number;
    manufacturer: string;
    puzzleType: string;
    color: string;
    difficultyLevel: string;
    materialType: string;
    images: ImageModel[];
}