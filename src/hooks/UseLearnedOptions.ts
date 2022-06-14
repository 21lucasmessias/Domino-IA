import axios from 'axios';
import { useMemo } from 'react';
import {
    SearchAlgorithm,
    SearchAlgorithmProps,
    SearchAlgorithmResponse,
} from '../models/Algorithm';
import { ChosenPiece, Piece, Player } from '../models/Types';

export const useLearnedOptions: () => SearchAlgorithm = () => {
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

    const asyncExecute: (
        props: SearchAlgorithmProps
    ) => Promise<SearchAlgorithmResponse | null> = async ({
        who,
        boardPieces,
    }) => {
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

        try {
            const chosenPiece = await axios.post<ChosenPiece>(
                'http://localhost:3001/choose',
                { possibilities },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            return {
                chosenPiece: chosenPiece.data,
                who: who,
            };
        } catch (e) {
            console.log(e);
            return null;
        }
    };

    const value = useMemo(() => {
        return {
            asyncExecute,
        };
    }, [asyncExecute]);

    return value;
};
