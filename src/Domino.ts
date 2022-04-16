import { useCallback, useMemo, useState } from 'react';

import { Location, Piece, Player } from './models/Types';

export interface DominoVariation {
    pieces: Array<Piece>;
    initialQtyOfPieces: number;
}

interface DominoGame {
    deck: Piece[];
    player: Player;
    agent: Player;
    boardPieces: Piece[];
    placePiece: (piece: Piece, location: Location) => void;
    start: () => void;
}

export const useDomino: (
    dominoVariation: () => DominoVariation
) => DominoGame = (dominoVariation) => {
    const { pieces, initialQtyOfPieces } = dominoVariation();

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
    }, [pieces, initialQtyOfPieces]);

    const start = useCallback(() => {
        const { newDeck, newPlayer, newAgent } = distributePieces();

        setDeck(newDeck);
        setPlayer(newPlayer);
        setAgent(newAgent);
        setBoardPieces([]);
    }, [distributePieces]);

    const removePieceFromAgent = useCallback(
        (piece: Piece) => {
            const newAgent = { ...agent };
            agent.pieces = agent.pieces.filter(
                (agentPiece) => agentPiece.id !== piece.id
            );
            setAgent(newAgent);
        },
        [agent]
    );

    const placePiece = useCallback(
        (piece: Piece, location: Location) => {
            removePieceFromAgent(piece);

            var newBoardPieces = [...boardPieces];

            if (location === 'start') {
                newBoardPieces = [piece, ...newBoardPieces];
            } else {
                newBoardPieces = [...newBoardPieces, piece];
            }

            setBoardPieces(newBoardPieces);
        },
        [boardPieces, removePieceFromAgent]
    );

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
