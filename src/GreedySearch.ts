import { useMemo } from 'react';
import {
    SearchAlgorithm,
    SearchAlgorithmProps,
    SearchAlgorithmResponse,
} from './models/Algorithm';
import { Location, Piece } from './models/Types';

export const useGreedySearch: (
    props: SearchAlgorithmProps
) => SearchAlgorithm = ({ agent, boardPieces }) => {
    const verifyMatch = (firstPiece: Piece, secondPiece: Piece): boolean => {
        return (
            firstPiece.left === secondPiece.left ||
            firstPiece.left === secondPiece.right ||
            firstPiece.right === secondPiece.left ||
            firstPiece.right === secondPiece.right
        );
    };

    const verifyPossibilities = (): Array<{
        piece: Piece;
        location: Location;
    }> => {
        const possibilities: Array<{
            piece: Piece;
            location: Location;
        }> = [];

        const [startPiece, endPiece] = [
            boardPieces[0],
            boardPieces[boardPieces.length - 1],
        ];

        agent.pieces.forEach((piece) => {
            if (verifyMatch(piece, startPiece)) {
                possibilities.push({
                    piece,
                    location: 'start',
                });
            } else if (verifyMatch(piece, endPiece)) {
                possibilities.push({
                    piece,
                    location: 'end',
                });
            }
        });

        return possibilities;
    };

    const execute = (): SearchAlgorithmResponse | null => {
        const possibilities = verifyPossibilities();

        if (possibilities.length === 0) {
            return null;
        }

        return {
            piece: possibilities[0].piece,
            location: possibilities[0].location,
            who: agent,
        };
    };

    const value = useMemo(() => {
        return {
            execute,
        };
    }, [execute]);

    return value;
};
