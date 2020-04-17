export interface PuzzleForUpdateModel{
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
}