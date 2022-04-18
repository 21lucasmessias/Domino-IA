import { DominoVariation } from '../hooks/UseDomino';
import { ChosenPiece, Piece, Player } from './Types';

export interface SearchAlgorithmProps {
    agent: Player;
    boardPieces: Piece[];
    useDominoVariation: () => DominoVariation;
}

export type SearchAlgorithmResponse = {
    chosenPiece: ChosenPiece;
    who: Player;
} | null;

export interface SearchAlgorithm {
    execute: () => SearchAlgorithmResponse;
}
