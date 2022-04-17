import { useToast } from '@chakra-ui/react';
import { useMemo, useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import {
    SearchAlgorithm,
    SearchAlgorithmProps,
    SearchAlgorithmResponse,
} from '../models/Algorithm';
import { Piece, Player } from '../models/Types';
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
    });

    const { execute } = useSearchAlgorithm({
        agent: agent(),
        boardPieces: boardPieces(),
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

    useEffect(() => {
        if (countDeadline >= 2) {
            setCountDeadline(0);
            toast({
                title: 'Empate',
                status: 'warning',
                position: 'top-end',
                isClosable: true,
            });
            var newAgent = agent();
            var newPlayer = player;

            setPlayersScores(newAgent, newPlayer);
        }
    }, [countDeadline]);

    const buyPiece = (who: Player): boolean => {
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
        //await delay(500);
        const searchAlgorithmResponse = execute();

        if (!searchAlgorithmResponse) {
            if (buyPiece(agent())) {
                handleExecute();
            } else {
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

    useEffect(() => {
        if (shift === 'agent') {
            handleExecute();
        }
    }, [shift]);

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

        toggleShift();
    };

    const value = useMemo(
        () => ({
            deck: deck(),
            player,
            agent: agent(),
            shift,
            boardPieces: boardPieces(),
            placePiece,
            start,
            buyPiece,
            toggleShift,
        }),
        [deck, player, agent, shift, boardPieces]
    );

    return value;
}
