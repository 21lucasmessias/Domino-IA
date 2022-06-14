import { ChosenPiece, Piece, Player } from './Types';

export interface SearchAlgorithmProps {
    who: Player;
    boardPieces: Piece[];
}

export type SearchAlgorithmResponse = {
    chosenPiece: ChosenPiece;
    who: Player;
} | null;

export interface SearchAlgorithm {
    execute?: (props: SearchAlgorithmProps) => SearchAlgorithmResponse;
    asyncExecute?: (
        props: SearchAlgorithmProps
    ) => Promise<SearchAlgorithmResponse | null>;
}
