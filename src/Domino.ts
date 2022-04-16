import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Piece, Player, Value } from './models/Types';

const useMonetaryPieces = () => {
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

export const useDomino = () => {
    const { pieces, initialQtyOfPieces } = useMonetaryPieces();

    const [deck, setDeck] = useState<Array<Piece>>([]);

    const [agent, setAgent] = useState<Player>({
        pieces: [],
        score: 0,
    });

    const [player, setPlayer] = useState<Player>({
        pieces: [],
        score: 0,
    });

    const [boardPieces, setBoardPieces] = useState<Array<Piece>>([]);

    const distributePieces = useCallback((): {
        newDeck: Piece[];
        newPlayer: Player;
        newAgent: Player;
    } => {
        const newDeck = [...pieces];

        const newPlayer: Player = {
            pieces: [],
            score: 0,
        };
        const newAgent: Player = {
            pieces: [],
            score: 0,
        };

        for (let i = 0; i < initialQtyOfPieces; i++) {
            const randomPosition = Math.floor(
                Math.random() * (newDeck.length - 1)
            );
            newPlayer.pieces.push(newDeck[randomPosition]);
            newDeck.splice(randomPosition, 1);
        }

        for (let i = 0; i < initialQtyOfPieces; i++) {
            const randomPosition = Math.floor(
                Math.random() * (newDeck.length - 1)
            );
            newAgent.pieces.push(newDeck[randomPosition]);
            newDeck.splice(randomPosition, 1);
        }

        return {
            newDeck,
            newPlayer,
            newAgent,
        };
    }, [pieces]);

    const start = useCallback(() => {
        const { newDeck, newAgent, newPlayer } = distributePieces();

        setDeck(newDeck);
        setPlayer(newPlayer);
        setAgent(newAgent);
        setBoardPieces([]);
    }, [pieces]);

    const placePiece = useCallback(() => {}, [boardPieces, agent]);

    const value = useMemo(
        () => ({
            deck,
            player,
            agent,
            boardPieces,
            placePiece,
            start,
        }),
        [deck, player, agent, boardPieces, placePiece, start]
    );

    return value;
};
