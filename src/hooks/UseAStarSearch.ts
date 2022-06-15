import { useMemo } from 'react';
import {
    SearchAlgorithm,
    SearchAlgorithmProps,
    SearchAlgorithmResponse,
} from '../models/Algorithm';
import { ChosenPiece, Piece, Player } from '../models/Types';

export const useAStarSearch: () => SearchAlgorithm = () => {
    const verifyPossibilities = (
        boardPieces: Array<Piece>,
        agent: Player
    ): Array<ChosenPiece> => {
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

    const recursive = (
        parentPiece: ChosenPiece,
        possibilities: Array<ChosenPiece>,
        depth: number,
        boardPieces: Array<Piece>,
        agent: Player
    ): { chosenPiece: ChosenPiece; depth: number } => {
        if (possibilities.length === 0) {
            return { chosenPiece: parentPiece, depth };
        }

        if (depth === 4) {
            return { chosenPiece: parentPiece, depth };
        }

        var maxDepth = 0;
        var chosenPieceWithMostPossiblesInFuture = possibilities[0];

        possibilities.forEach((chosenPiece) => {
            var boardWithoutPiece: Array<Piece> = [];
            if (chosenPiece.location === 'end') {
                boardWithoutPiece = [...boardPieces, chosenPiece.piece];
            } else {
                boardWithoutPiece = [chosenPiece.piece, ...boardPieces];
            }

            const agentWithoutPiece = {
                ...agent,
                pieces: agent.pieces.filter(
                    (piece) => piece.id !== chosenPiece.piece.id
                ),
            };

            const possibilitiesCurrent = verifyPossibilities(
                boardWithoutPiece,
                agentWithoutPiece
            );

            const result = recursive(
                chosenPiece,
                possibilitiesCurrent,
                depth + 1,
                boardWithoutPiece,
                agentWithoutPiece
            );

            if (result.depth > maxDepth) {
                chosenPieceWithMostPossiblesInFuture = parentPiece;
                maxDepth = result.depth;
            }
        });

        return {
            chosenPiece: chosenPieceWithMostPossiblesInFuture,
            depth: maxDepth,
        };
    };

    const execute: (
        props: SearchAlgorithmProps
    ) => SearchAlgorithmResponse | null = ({ who, boardPieces }) => {
        const possibilities = verifyPossibilities(boardPieces, who);

        /* buy piece */
        if (possibilities.length === 0) {
            return null;
        }

        /* euristic 1 */
        if (possibilities.length === 1) {
            return {
                chosenPiece: possibilities[0],
                who: who,
            };
        }

        /* euristic 2 */
        const higherDouble = verifyDouble(possibilities);
        if (higherDouble !== null) {
            return {
                chosenPiece: higherDouble,
                who: who,
            };
        }

        /* euristic 3 */
        var { chosenPiece: chosenPieceWithMostPossiblesInFuture, depth } =
            recursive(possibilities[0], possibilities, 0, boardPieces, who);

        return {
            chosenPiece: chosenPieceWithMostPossiblesInFuture,
            who: who,
        };
    };

    const value = useMemo(() => {
        return {
            execute,
        };
    }, [execute]);

    return value;
};
