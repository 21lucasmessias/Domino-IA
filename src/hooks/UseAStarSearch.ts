import { useMemo } from 'react';
import {
    SearchAlgorithm,
    SearchAlgorithmProps,
    SearchAlgorithmResponse,
} from '../models/Algorithm';
import { ChosenPiece, Piece } from '../models/Types';

export const useAStarSearch: (
    props: SearchAlgorithmProps
) => SearchAlgorithm = ({ agent, boardPieces, piecesThatPlayerDontHave }) => {
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

    const verifyDouble = (
        possibilities: Array<ChosenPiece>
    ): ChosenPiece | null => {
        var higherDoubleChosenPiece: ChosenPiece | null = null;

        possibilities.forEach((chosenPiece) => {
            if (chosenPiece.piece.left === chosenPiece.piece.right) {
                if (higherDoubleChosenPiece === null) {
                    higherDoubleChosenPiece = chosenPiece;
                } else if (
                    chosenPiece.piece.left > higherDoubleChosenPiece.piece.left
                ) {
                    higherDoubleChosenPiece = chosenPiece;
                }
            }
        });

        return higherDoubleChosenPiece;
    };

    const execute = (): SearchAlgorithmResponse | null => {
        const possibilities = verifyPossibilities();

        /* buy piece */
        if (possibilities.length === 0) {
            return null;
        }

        /* euristic 1 */
        if (possibilities.length === 1) {
            return {
                chosenPiece: possibilities[0],
                who: agent,
            };
        }

        /* euristic 2 */
        const higherDouble = verifyDouble(possibilities);
        if (higherDouble !== null) {
            return {
                chosenPiece: higherDouble,
                who: agent,
            };
        }

        /* euristic 3 */
        //const knowPieces = [...agent.pieces, ...boardPieces];

        /* last euristic */
        var higherValueChosenPiece: ChosenPiece = possibilities[0];
        var higherValueChosenPieceValue = 0;
        var currentPieceValue = 0;

        possibilities.forEach((chosenPiece) => {
            currentPieceValue =
                chosenPiece.piece.left + chosenPiece.piece.right;

            higherValueChosenPieceValue =
                higherValueChosenPiece.piece.right +
                higherValueChosenPiece.piece.left;

            if (currentPieceValue > higherValueChosenPieceValue) {
                higherValueChosenPiece = chosenPiece;
            }
        });

        return {
            chosenPiece: higherValueChosenPiece,
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
