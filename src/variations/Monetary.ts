import { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { DominoVariation } from '../Domino';
import { Piece, Value } from '../models/Types';

export const useMonetaryPieces: () => DominoVariation = () => {
    const initialQtyOfPieces = 12;
    const [pieces, setPieces] = useState<Array<Piece>>([]);

    useEffect(() => {
        const possiblePieces: Array<Value> = [
            0, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 50, 100, 200,
        ];

        const newPieces = [];

        for (let i = 0; i < possiblePieces.length; i++) {
            for (let j = 0; j <= i; j++) {
                const newPiece: Piece = {
                    id: uuid(),
                    left: possiblePieces[j],
                    right: possiblePieces[i],
                };

                newPieces.push(newPiece);
            }
        }

        setPieces(newPieces);
    }, []);

    const value = useMemo(() => ({ pieces, initialQtyOfPieces }), [pieces]);

    return value;
};
