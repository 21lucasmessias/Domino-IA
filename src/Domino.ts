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
    shift: string | undefined;
    placePiece: (props: SearchAlgorithmResponse) => void;
    start: () => void;
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
        var { newDeck, newPlayer, newAgent } = distributePieces();

        setDeck(newDeck);

        const { piece, startingPlayer } = getStartingPlayer(
            newAgent.pieces,
            newPlayer.pieces
        );

        if (startingPlayer === 'agent') {
            newAgent = placeFirstPiece(piece, newAgent);
        } else {
            newPlayer = placeFirstPiece(piece, newPlayer);
        }

        setPlayer(newPlayer);
        setAgent(newAgent);
    }, [distributePieces]);

    const removePieceFromPlayer = useCallback((piece: Piece, who: Player) => {
        who.pieces = who.pieces.filter(
            (playerPiece) => playerPiece.id !== piece.id
        );

        return who;
    }, []);

    const placeFirstPiece = useCallback(
        (piece: Piece, who: Player) => {
            who = removePieceFromPlayer(piece, who);

            var newBoardPieces = [...boardPieces];
            newBoardPieces = [...newBoardPieces, piece];

            setBoardPieces(newBoardPieces);

            setTimeout(() => {
                console.log(boardPieces);
            }, 3000);
            return who;
        },
        [removePieceFromPlayer]
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
            var mockPiece = playerPieces[0];
            mockPiece.left = 0;
            mockPiece.right = 0;

            var higherDoubleAgentPiece = mockPiece;
            var higherDoublePlayerPiece = mockPiece;
            var higherValueAgentPieceNumber = 0;
            var higherValuePlayerPieceNumber = 0;
            var higherValueAgentPiece = agentPieces[0];
            var higherValuePlayerPiece = playerPieces[0];

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
                    return {
                        piece: higherDoubleAgentPiece,
                        startingPlayer: 'agent',
                    };
                return {
                    piece: higherDoublePlayerPiece,
                    startingPlayer: 'player',
                };
            }
            //se nenhum tem carta espelhada
            agentPieces.forEach((piece) => {
                var currentPieceValue = piece.left + piece.right;
                if (currentPieceValue >= higherValueAgentPieceNumber) {
                    higherValueAgentPiece = piece;
                    higherValueAgentPieceNumber = currentPieceValue;
                }
            });
            console.log(playerPieces);
            playerPieces.forEach((piece) => {
                var currentPieceValue = piece.left + piece.right;
                console.log(currentPieceValue);
                if (currentPieceValue >= higherValuePlayerPieceNumber) {
                    higherValuePlayerPiece = piece;
                    higherValuePlayerPieceNumber = currentPieceValue;
                }
            });
            if (higherValueAgentPieceNumber > higherValuePlayerPieceNumber)
                return {
                    piece: higherValueAgentPiece,
                    startingPlayer: 'agent',
                };
            return {
                piece: higherValuePlayerPiece,
                startingPlayer: 'player',
            };
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
        (who: Player): boolean => {
            if (deck.length === 0) {
                return false;
            }

            const newDeck = [...deck];
            const randomPosition = Math.floor(
                Math.random() * (newDeck.length - 1)
            );

            if (who.id === player.id) {
                const newPlayer = { ...who };
                newPlayer.pieces.push(newDeck[randomPosition]);
                setPlayer(newPlayer);
            } else {
                const newAgent = { ...who };
                newAgent.pieces.push(newDeck[randomPosition]);
                setAgent(newAgent);
            }

            newDeck.splice(randomPosition, 1);

            setDeck(newDeck);

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
                        title: 'Bloqueado',
                        status: 'error',
                    });

                    toggleShift();
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
            placeFirstPiece,
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
