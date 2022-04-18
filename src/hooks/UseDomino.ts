import { useToast } from '@chakra-ui/react';
import { useMemo, useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import {
    SearchAlgorithm,
    SearchAlgorithmProps,
    SearchAlgorithmResponse,
} from '../models/Algorithm';
import { Piece, Player, Value } from '../models/Types';
import { delay } from '../utils/delay';
import { useStart } from './UseStart';
import useSyncState from './UseSyncState';

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
    endOfMatch: boolean;
    endOfGame: boolean;
    placePiece: (props: SearchAlgorithmResponse) => void;
    start: (agent?: Player, player?: Player) => void;
    buyPiece: (who: Player) => boolean;
    toggleShift: () => void;
}

export function useDomino({
    useDominoVariation,
    useSearchAlgorithm,
}: DominoGameProps): DominoGame {
    const toast = useToast();

    const [countGames, setCountGames] = useState(0);
    const [endOfMatch, setEndOfMatch] = useState(false);
    const [endOfGame, setEndOfGame] = useState(false);

    const [shift, setShift] = useState<'agent' | 'player' | undefined>(
        undefined
    );

    const [countDeadline, setCountDeadline] = useState(0);

    const { get: deck, set: setDeck } = useSyncState<Array<Piece>>([]);
    const { get: agent, set: setAgent } = useSyncState<Player>({
        id: uuid(),
        pieces: [],
        score: 0,
    });
    const { get: boardPieces, set: setBoardPieces } = useSyncState<
        Array<Piece>
    >([]);
    const { get: piecesThatPlayerDontHave, set: setPiecesThatPlayerDontHave } =
        useSyncState<Array<Value>>([]);

    const [player, setPlayer] = useState<Player>({
        id: uuid(),
        pieces: [],
        score: 0,
    });

    const { start } = useStart({
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
    });

    const { execute } = useSearchAlgorithm({
        agent: agent(),
        boardPieces: boardPieces(),
        piecesThatPlayerDontHave: piecesThatPlayerDontHave(),
    });

    const removePieceFromPlayer = (piece: Piece, who: Player) => {
        const newPlayer = { ...who };

        newPlayer.pieces = newPlayer.pieces.filter(
            (playerPiece) => playerPiece.id !== piece.id
        );

        return newPlayer;
    };

    const setPlayersScores = (agent: Player, player: Player) => {
        var agentPiecesCounter = 0;
        var playerPiecesCounter = 0;
        var currentPieceValue = 0;
        agent.pieces.forEach((piece) => {
            currentPieceValue = piece.left + piece.right;
            agentPiecesCounter += currentPieceValue;
        });

        player.pieces.forEach((piece) => {
            currentPieceValue = piece.left + piece.right;
            playerPiecesCounter += currentPieceValue;
        });

        if (agentPiecesCounter < playerPiecesCounter) {
            agent.score = agent.score + playerPiecesCounter;
        } else {
            player.score = player.score + agentPiecesCounter;
        }

        setAgent(agent);
        setPlayer(player);
    };

    const buyPiece = (who: Player): boolean => {
        if (who.id === player.id) {
            const startBoardPiece = boardPieces()[0];
            const endBoardPiece = boardPieces()[boardPieces().length - 1];

            setPiecesThatPlayerDontHave([
                startBoardPiece.rotated
                    ? startBoardPiece.right
                    : startBoardPiece.left,
                endBoardPiece.rotated
                    ? endBoardPiece.left
                    : endBoardPiece.right,
            ]);
        }

        if (deck().length === 0) {
            setCountDeadline((oldState) => oldState + 1);
            return false;
        }

        const newDeck = [...deck()];
        const randomPosition = Math.floor(Math.random() * (newDeck.length - 1));

        if (who.id === player.id) {
            const newPlayer = { ...who };
            newPlayer.pieces.push(newDeck[randomPosition]);
            newDeck.splice(randomPosition, 1);

            setPlayer(newPlayer);
            setDeck(newDeck);
        } else {
            const newAgent = { ...who };
            newAgent.pieces.push(newDeck[randomPosition]);
            newDeck.splice(randomPosition, 1);
            setAgent(newAgent);
            setDeck(newDeck);
        }

        return true;
    };

    const handleExecute = async () => {
        await delay(300);
        const searchAlgorithmResponse = execute();

        if (!searchAlgorithmResponse) {
            if (buyPiece(agent())) {
                handleExecute();
            } else {
                toast.closeAll();
                toast({
                    title: 'Bloqueado',
                    status: 'error',
                    position: 'top',
                });

                toggleShift();
            }
        } else {
            placePiece(searchAlgorithmResponse);
        }
    };

    const toggleShift = () => {
        if (shift === 'agent') {
            setShift('player');
        } else {
            setShift('agent');
        }
    };

    const placePiece = (props: SearchAlgorithmResponse) => {
        if (!props) return;

        const { chosenPiece, who } = props;

        const newWho = removePieceFromPlayer(chosenPiece.piece, who);

        var newBoardPieces = [...boardPieces()];

        if (chosenPiece.location === 'start') {
            newBoardPieces = [chosenPiece.piece, ...newBoardPieces];
        } else {
            newBoardPieces = [...newBoardPieces, chosenPiece.piece];
        }

        if (newWho.id === player.id) {
            setPlayer(newWho);
            setBoardPieces(newBoardPieces);
        } else {
            setAgent(newWho);
            setBoardPieces(newBoardPieces);
        }

        setCountDeadline(0);

        if (newWho.pieces.length != 0) {
            toggleShift();
        }
    };

    /* Verify if is turn of agent and execute search algorithm */
    useEffect(() => {
        if (shift === 'agent') {
            handleExecute();
        }
    }, [shift]);

    /* Verify Game Winner */
    useEffect(() => {
        if (countGames === 3) {
            setEndOfGame(true);

            toast.closeAll();

            toast({
                title: 'Resultado final',
                description: `Jogador: ${player.score} X Máquina: ${
                    agent().score
                }`,
                status: 'info',
                position: 'bottom',
                isClosable: true,
            });

            if (player.score > agent().score) {
                toast({
                    title: 'Você ganhou a partida, parabéns!',
                    status: 'success',
                    position: 'top',
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Você perdeu a partida, tente novamente!',
                    status: 'error',
                    position: 'top',
                    isClosable: true,
                });
            }
        }
    }, [countGames, player, agent]);

    /* Verify Draw */
    useEffect(() => {
        if (countDeadline >= 2) {
            setCountDeadline(0);
            toast.closeAll();
            toast({
                title: 'Empate',
                status: 'info',
                position: 'top-end',
                isClosable: true,
            });
            var newAgent = agent();
            var newPlayer = player;

            setEndOfMatch(true);
            setPlayersScores(newAgent, newPlayer);
            setCountGames(countGames + 1);
        }
    }, [countDeadline, countGames]);

    /* Verify Match Winner */
    useEffect(() => {
        if (boardPieces().length > 0) {
            if (player.pieces.length === 0) {
                toast({
                    title: 'Você ganhou a rodada',
                    status: 'success',
                    position: 'top-end',
                    isClosable: true,
                });

                setEndOfMatch(true);
                setCountGames(countGames + 1);
                setPlayersScores(agent(), player);
            } else if (agent().pieces.length === 0) {
                toast({
                    title: 'Agente ganhou a rodada',
                    status: 'error',
                    position: 'top-end',
                    isClosable: true,
                });

                setEndOfMatch(true);
                setCountGames(countGames + 1);
                setPlayersScores(agent(), player);
            }
        }
    }, [player, agent, boardPieces, countGames]);

    const value = useMemo(
        () => ({
            deck: deck(),
            player,
            agent: agent(),
            shift,
            boardPieces: boardPieces(),
            endOfMatch,
            endOfGame,
            placePiece,
            start,
            buyPiece,
            toggleShift,
        }),
        [deck, player, agent, shift, boardPieces]
    );

    return value;
}
