import { ChosenPiece, Piece, Player, Value } from './Types';

export interface SearchAlgorithmProps {
    agent: Player;
    boardPieces: Piece[];
    piecesThatPlayerDontHave?: Value[];
}

export type SearchAlgorithmResponse = {
    chosenPiece: ChosenPiece;
    who: Player;
} | null;

export interface SearchAlgorithm {
    execute: () => SearchAlgorithmResponse;
}
