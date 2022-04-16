import { useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
    SearchAlgorithm,
    SearchAlgorithmProps,
    SearchAlgorithmResponse,
} from './models/Algorithm';
import { Piece, Player } from './models/Types';

export interface DominoVariation {
    pieces: Array<Piece>;
    initialQtyOfPieces: number;
}

interface DominoGameProps {
    useDominoVariation: () => DominoVariation;
    useSearchAlgorithm: (props: SearchAlgorithmProps) => SearchAlgorithm;
}

interface DominoGame {
    deck: Piece[];
    player: Player;
    agent: Player;
    boardPieces: Piece[];
    shift: 'agent' | 'player' | undefined;
    placePiece: (props: SearchAlgorithmResponse) => void;
    start: () => void;
    getStartingPlayer: (
        agentPieces: Array<Piece>,
        playerPieces: Array<Piece>
    ) => 'agent' | 'player';
    toggleShift: () => void;
}

export const useDomino: (props: DominoGameProps) => DominoGame = ({
    useDominoVariation,
    useSearchAlgorithm,
}) => {
    const toast = useToast();

    const [shift, setShift] = useState<'agent' | 'player' | undefined>(
        undefined
    );
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

    const { pieces, initialQtyOfPieces } = useDominoVariation();
    const { execute } = useSearchAlgorithm({ agent, boardPieces });

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

        const startingPlayer = getStartingPlayer(
            newAgent.pieces,
            newPlayer.pieces
        );
        setShift(startingPlayer);
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

    const getStartingPlayer = useCallback(
        (agentPieces: Array<Piece>, playerPieces: Array<Piece>) => {
            var higherDoubleAgentPiece = { left: -1, right: -1 };
            var higherDoublePlayerPiece = { left: -1, right: -1 };
            var higherValueAgentPiece = 0;
            var higherValuePlayerPiece = 0;

            agentPieces.forEach((piece) => {
                if (piece.left === piece.right) {
                    if (piece.left > higherDoubleAgentPiece.left)
                        higherDoubleAgentPiece = piece;
                }
            });

            playerPieces.forEach((piece) => {
                if (piece.left === piece.right) {
                    if (piece.left > higherDoublePlayerPiece.left)
                        higherDoublePlayerPiece = piece;
                }
            });

            if (higherDoubleAgentPiece.left !== higherDoublePlayerPiece.left) {
                //se algum player tem carta espelhada
                if (higherDoubleAgentPiece.left > higherDoublePlayerPiece.left)
                    // se a carta espelhada do agente é maior que a do player
                    return 'agent';
                return 'player';
            } else {
                //se nenhum tem carta espelhada
                agentPieces.forEach((piece) => {
                    var currentPieceValue = piece.left + piece.right;
                    if (currentPieceValue >= higherValueAgentPiece)
                        higherValueAgentPiece = currentPieceValue;
                });

                playerPieces.forEach((piece) => {
                    var currentPieceValue = piece.left + piece.right;
                    if (currentPieceValue >= higherValuePlayerPiece)
                        higherValuePlayerPiece = currentPieceValue;
                });
                if (higherValueAgentPiece > higherValuePlayerPiece)
                    return 'agent';
                return 'player';
            }
        },
        []
    );

    const toggleShift = useCallback(() => {
        if (shift === 'agent') {
            setShift('player');
            return;
        }
        setShift('agent');
        return;
    }, [shift]);

    const buyPiece = useCallback(
        (player: Player) => {
            if (deck.length === 0) {
                return false;
            }

            const newDeck = [...deck];
            const newPlayer = { ...player };

            const randomPosition = Math.floor(
                Math.random() * (newDeck.length - 1)
            );
            newPlayer.pieces.push(newDeck[randomPosition]);
            newDeck.splice(randomPosition, 1);

            setDeck(newDeck);
            setPlayer(newPlayer);

            return true;
        },
        [deck]
    );

    useEffect(() => {
        if (shift === 'agent') {
            var res = execute();

            while (!res) {
                const successfullBought = buyPiece(agent);
                if (!successfullBought) {
                    toast({
                        title: 'Compra',
                        status: 'error',
                        description: 'Bloqueado',
                    });

                    return;
                }

                res = execute();
            }

            placePiece(res);
            toggleShift();
        }
    }, [shift, buyPiece]);

    const value = useMemo(
        () => ({
            deck,
            player,
            agent,
            shift,
            boardPieces,
            placePiece,
            start,
            getStartingPlayer,
            toggleShift,
        }),
        [
            deck,
            player,
            agent,
            boardPieces,
            shift,
            placePiece,
            start,
            toggleShift,
        ]
    );

    return value;
};
