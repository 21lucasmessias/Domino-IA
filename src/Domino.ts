import { useCallback, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useGreedySearch } from './GreedySearch';
import { SearchAlgorithmResponse } from './models/Algorithm';
import { Piece, Player } from './models/Types';

export interface DominoVariation {
    pieces: Array<Piece>;
    initialQtyOfPieces: number;
}

interface DominoGame {
    deck: Piece[];
    player: Player;
    agent: Player;
    boardPieces: Piece[];
    placePiece: (props: SearchAlgorithmResponse) => void;
    start: () => void;
    getStartingPlayer: (pieces: Array<Piece>) => string;
}

export const useDomino: (
    dominoVariation: () => DominoVariation
) => DominoGame = (dominoVariation) => {
    const shift = undefined;
    const [deck, setDeck] = useState<Array<Piece>>([]);
    const [agent, setAgent] = useState<Player>({
        id: uuid(),
        pieces: [],
        score: 0,
    });

    const [player, setPlayer] = useState<Player>({
        id: uuid(),
        pieces: [],
        score: 0,
    });

    const [boardPieces, setBoardPieces] = useState<Array<Piece>>([]);

    const { pieces, initialQtyOfPieces } = dominoVariation();
    const { execute } = useGreedySearch({ agent, boardPieces });

    const distributePieces = useCallback((): {
        newDeck: Piece[];
        newPlayer: Player;
        newAgent: Player;
    } => {
        const newDeck = [...pieces];

        const newPlayer: Player = {
            id: uuid(),
            pieces: [],
            score: 0,
        };
        const newAgent: Player = {
            id: uuid(),
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

    const removePieceFromPlayer = useCallback(
        (piece: Piece, who: Player) => {
            if (who.id === player.id) {
                const newPlayer = { ...player };
                player.pieces = player.pieces.filter(
                    (playerPiece) => playerPiece.id !== piece.id
                );
                setAgent(newPlayer);
            } else {
                const newAgent = { ...agent };
                agent.pieces = agent.pieces.filter(
                    (agentPiece) => agentPiece.id !== piece.id
                );
                setAgent(newAgent);
            }
        },
        [player, agent]
    );

    const placePiece = useCallback(
        ({ piece, location, who }) => {
            removePieceFromPlayer(piece, who);

            var newBoardPieces = [...boardPieces];

            if (location === 'start') {
                newBoardPieces = [piece, ...newBoardPieces];
            } else {
                newBoardPieces = [...newBoardPieces, piece];
            }

            setBoardPieces(newBoardPieces);
        },
        [boardPieces, removePieceFromPlayer]
    );

    const getStartingPlayer = useCallback((pieces: Array<Piece>) => {
        console.log(pieces);
        return 'aaa';
    }, []);

    const value = useMemo(
        () => ({
            deck,
            player,
            agent,
            boardPieces,
            placePiece,
            start,
            getStartingPlayer,
        }),
        [deck, player, agent, boardPieces, placePiece, start]
    );

    return value;
};
