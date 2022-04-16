import { Location, Piece, Player } from './Types';

export interface SearchAlgorithmProps {
    agent: Player;
    boardPieces: Array<Piece>;
}

export type SearchAlgorithmResponse = {
    piece: Piece;
    location: Location;
    who: Player;
} | null;

export interface SearchAlgorithm {
    execute: () => SearchAlgorithmResponse;
}
