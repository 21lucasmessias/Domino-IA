import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { DominoVariation } from './UseDomino';
import { Piece, Player, Value } from '../models/Types';

interface StartProps {
    useDominoVariation: () => DominoVariation;
    setDeck: (newValue: Piece[]) => Piece[];
    setPlayer: React.Dispatch<React.SetStateAction<Player>>;
    setAgent: (newValue: Player) => Player;
    setBoardPieces: (newValue: Piece[]) => Piece[];
    setShift: React.Dispatch<
        React.SetStateAction<'agent' | 'player' | undefined>
    >;
    setPiecesThatPlayerDontHave: (newValue: Value[]) => Value[];
    setCountGames: React.Dispatch<React.SetStateAction<number>>;
    setEndOfMatch: React.Dispatch<React.SetStateAction<boolean>>;
    setEndOfGame: React.Dispatch<React.SetStateAction<boolean>>;
}

interface StartResponse {
    start: (agent?: Player, player?: Player) => void;
}

export function useStart({
    useDominoVariation,
    setDeck,
    setPlayer,
    setAgent,
    setBoardPieces,
    setShift,
    setPiecesThatPlayerDontHave,
    setCountGames,
    setEndOfMatch,
    setEndOfGame,
}: StartProps): StartResponse {
    const { pieces, initialQtyOfPieces } = useDominoVariation();

    const distributePieces = useCallback(
        (
            agent?: Player,
            player?: Player
        ): {
            newDeck: Piece[];
            newPlayer: Player;
            newAgent: Player;
        } => {
            const newDeck = [...pieces];

            const newPlayer: Player = {
                id: player ? player.id : uuid(),
                pieces: [],
                score: player ? player.score : 0,
            };
            const newAgent: Player = {
                id: agent ? agent.id : uuid(),
                pieces: [],
                score: agent ? agent.score : 0,
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
        },
        [pieces, initialQtyOfPieces]
    );

    const getStartingPlayer = useCallback(
        (agentPieces: Array<Piece>, playerPieces: Array<Piece>) => {
            var higherDoubleAgentPiece = agentPieces.find(
                (piece) => piece.left === piece.right
            );
            var higherDoublePlayerPiece = playerPieces.find(
                (piece) => piece.left === piece.right
            );

            if (higherDoubleAgentPiece && !higherDoublePlayerPiece) {
                return {
                    piece: higherDoubleAgentPiece,
                    startingPlayer: 'agent',
                };
            }

            if (!higherDoubleAgentPiece && higherDoublePlayerPiece) {
                return {
                    piece: higherDoublePlayerPiece,
                    startingPlayer: 'player',
                };
            }

            if (higherDoubleAgentPiece && higherDoublePlayerPiece) {
                agentPieces.forEach((piece) => {
                    if (piece.left === piece.right) {
                        if (piece.left > higherDoubleAgentPiece!.left) {
                            higherDoubleAgentPiece = piece;
                        }
                    }
                });

                playerPieces.forEach((piece) => {
                    if (piece.left === piece.right) {
                        if (piece.left > higherDoublePlayerPiece!.left) {
                            higherDoublePlayerPiece = piece;
                        }
                    }
                });

                if (higherDoubleAgentPiece.left > higherDoublePlayerPiece.left)
                    return {
                        piece: higherDoubleAgentPiece,
                        startingPlayer: 'agent',
                    };
                return {
                    piece: higherDoublePlayerPiece,
                    startingPlayer: 'player',
                };
            }

            // ------ se nenhum tem carta espelhada ------

            var higherValueAgentPieceNumber =
                agentPieces[0].left + agentPieces[0].right;

            var higherValueAgentPiece = agentPieces[0];

            agentPieces.forEach((piece) => {
                const currentPieceValue = piece.left + piece.right;
                if (currentPieceValue >= higherValueAgentPieceNumber) {
                    higherValueAgentPiece = piece;
                    higherValueAgentPieceNumber = currentPieceValue;
                }
            });

            var higherValuePlayerPieceNumber =
                playerPieces[0].left + playerPieces[0].right;

            var higherValuePlayerPiece = playerPieces[0];

            playerPieces.forEach((piece) => {
                const currentPieceValue = piece.left + piece.right;

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

    const removePieceFromPlayer = useCallback((piece: Piece, who: Player) => {
        const newPlayer = { ...who };

        newPlayer.pieces = newPlayer.pieces.filter(
            (playerPiece) => playerPiece.id !== piece.id
        );

        return newPlayer;
    }, []);

    const placeFirstPiece = useCallback((piece: Piece, who: Player) => {
        var newWho = { ...who };

        newWho = removePieceFromPlayer(piece, who);

        var newBoard = [piece];

        return {
            newWho,
            newBoard,
        };
    }, []);

    const start = useCallback(
        (agent?: Player, player?: Player) => {
            if (agent && player) {
                var { newDeck, newPlayer, newAgent } = distributePieces(
                    agent,
                    player
                );
            } else {
                var { newDeck, newPlayer, newAgent } = distributePieces();
                setCountGames(0);
            }

            var newBoardPieces = [];
            var shift: 'agent' | 'player' = 'player';

            const { piece, startingPlayer } = getStartingPlayer(
                newAgent.pieces,
                newPlayer.pieces
            );

            if (startingPlayer === 'agent') {
                const { newWho, newBoard } = placeFirstPiece(piece, newAgent);
                newAgent = newWho;
                newBoardPieces = newBoard;
                shift = 'player';
            } else {
                const { newWho, newBoard } = placeFirstPiece(piece, newPlayer);
                newPlayer = newWho;
                newBoardPieces = newBoard;
                shift = 'agent';
            }

            setEndOfMatch(false);
            setEndOfGame(false);
            setDeck(newDeck);
            setPlayer(newPlayer);
            setAgent(newAgent);
            setBoardPieces(newBoardPieces);
            setShift(shift);
            setPiecesThatPlayerDontHave([]);
        },
        [distributePieces, getStartingPlayer, placeFirstPiece]
    );

    const value = useMemo(
        () => ({
            start,
        }),
        [start]
    );

    return value;
}
