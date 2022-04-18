import { useMemo } from 'react';
import {
    SearchAlgorithm,
    SearchAlgorithmProps,
    SearchAlgorithmResponse,
} from '../models/Algorithm';
import { ChosenPiece, Piece, Player } from '../models/Types';

export const useAStarSearch: (
    props: SearchAlgorithmProps
) => SearchAlgorithm = ({ agent, boardPieces, useDominoVariation }) => {
    const { pieces: allVariationPieces } = useDominoVariation();

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
        chosenPiece: ChosenPiece,
        possibilities: Array<ChosenPiece>,
        depth: number,
        boardPieces: Array<Piece>,
        agent: Player
    ): { chosenPiece: ChosenPiece; countPossibilities: number } => {
        if (possibilities.length === 0) {
            return { chosenPiece, countPossibilities: 0 };
        }

        if (depth === 3) {
            // utilizar o depth para decidir qual é o melhor ao invés da quantidade de possibilidades
            return { chosenPiece, countPossibilities: 0 };
        }

        var possibilitiesCount = -1;
        var chosenPieceWithMostPossiblesInFuture = possibilities[0];

        possibilities.forEach((chosenPiece) => {
            const boardWithtouPiece = [...boardPieces, chosenPiece.piece]; // verificar se é no inicio ou final q coloca a peça
            const agentWithoutPiece = {
                ...agent,
                pieces: agent.pieces.filter(
                    (piece) => piece.id !== chosenPiece.piece.id
                ),
            };

            const possibilitiesCurrent = verifyPossibilities(
                boardWithtouPiece,
                agentWithoutPiece
            );

            const result = recursive(
                chosenPiece,
                possibilitiesCurrent,
                depth + 1,
                boardWithtouPiece,
                agentWithoutPiece
            );

            if (result.countPossibilities > possibilitiesCount) {
                chosenPieceWithMostPossiblesInFuture = chosenPiece;
                possibilitiesCount =
                    result.countPossibilities + possibilities.length;
            }
        });

        return {
            chosenPiece: chosenPieceWithMostPossiblesInFuture,
            countPossibilities: possibilitiesCount,
        };
    };

    const execute = (): SearchAlgorithmResponse | null => {
        const possibilities = verifyPossibilities(boardPieces, agent);

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
        var {
            chosenPiece: chosenPieceWithMostPossiblesInFuture,
            countPossibilities,
        } = recursive(possibilities[0], possibilities, 0, boardPieces, agent);

        return {
            chosenPiece: chosenPieceWithMostPossiblesInFuture,
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
