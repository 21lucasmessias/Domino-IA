import { ChosenPiece, Piece, Player } from './Types';

export interface SearchAlgorithmProps {
    agent: Player;
    boardPieces: Array<Piece>;
}

export type SearchAlgorithmResponse = {
    chosenPiece: ChosenPiece;
    who: Player;
} | null;

export interface SearchAlgorithm {
    execute: () => SearchAlgorithmResponse;
}
