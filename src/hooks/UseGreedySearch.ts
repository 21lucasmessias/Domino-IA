import { useMemo } from 'react';
import {
    SearchAlgorithm,
    SearchAlgorithmProps,
    SearchAlgorithmResponse,
} from '../models/Algorithm';
import { ChosenPiece, Piece } from '../models/Types';

export const useGreedySearch: (
    props: SearchAlgorithmProps
) => SearchAlgorithm = ({ agent, boardPieces }) => {
    const verifyPossibilities = (): Array<ChosenPiece> => {
        const newPossiblePieces: Array<Piece> = [];

        if (boardPieces.length === 0) {
            return [];
        }

        var [startPiece, endPiece] = [
            boardPieces[0],
            boardPieces[boardPieces.length - 1],
        ];

        if (startPiece.rotated) {
            startPiece = {
                ...startPiece,
                left: startPiece.right,
                right: startPiece.left,
            };
        }

        if (endPiece.rotated) {
            endPiece = {
                ...endPiece,
                left: endPiece.right,
                right: endPiece.left,
            };
        }

        agent.pieces.forEach((piece) => {
            if (
                startPiece.left === piece.left ||
                startPiece.left === piece.right
            ) {
                newPossiblePieces.push(piece);
            } else if (
                endPiece.right === piece.left ||
                endPiece.right === piece.right
            ) {
                newPossiblePieces.push(piece);
            }
        });

        const newChosenPieces: Array<ChosenPiece> = [];

        newPossiblePieces.forEach((piece) => {
            if (startPiece.left === piece.right) {
                newChosenPieces.push({
                    piece: {
                        ...piece,
                        rotated: false,
                    },
                    location: 'start',
                });
            }

            if (startPiece.left === piece.left) {
                newChosenPieces.push({
                    piece: {
                        ...piece,
                        rotated: true,
                    },
                    location: 'start',
                });
            }

            if (endPiece.right === piece.left) {
                newChosenPieces.push({
                    piece: {
                        ...piece,
                        rotated: false,
                    },
                    location: 'end',
                });
            }

            if (endPiece.right === piece.right) {
                newChosenPieces.push({
                    piece: {
                        ...piece,
                        rotated: true,
                    },
                    location: 'end',
                });
            }
        });

        return newChosenPieces;
    };

    const execute = (): SearchAlgorithmResponse | null => {
        const possibilities = verifyPossibilities();

        if (possibilities.length === 0) {
            return null;
        }

        if (possibilities.length === 1) {
            return {
                chosenPiece: {
                    piece: possibilities[0].piece,
                    location: possibilities[0].location,
                },
                who: agent,
            };
        }

        return {
            chosenPiece: {
                piece: possibilities[1].piece,
                location: possibilities[1].location,
            },
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
