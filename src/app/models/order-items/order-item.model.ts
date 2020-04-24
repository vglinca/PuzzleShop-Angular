import { PuzzleTableRowModel } from '../puzzles/puzzle-table-row.model';

export interface OrderItemModel{
    id: number;
    cost: number;
    quantity: number;
    puzzle: PuzzleTableRowModel;
}