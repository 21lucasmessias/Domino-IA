import { useToast } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
    SearchAlgorithm,
    SearchAlgorithmProps,
    SearchAlgorithmResponse,
} from '../models/Algorithm';
import { Piece, Player } from '../models/Types';
import { useStart } from './UseStart';

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
    buyPiece: (who: Player) => void;
}

export function useDomino({
    useDominoVariation,
    useSearchAlgorithm,
}: DominoGameProps): DominoGame {
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

    const { start } = useStart({
        useDominoVariation,
        setDeck,
        setPlayer,
        setAgent,
        setBoardPieces,
        setShift,
    });

    const { execute } = useSearchAlgorithm({ agent, boardPieces });

    const removePieceFromPlayer = useCallback((piece: Piece, who: Player) => {
        const newPlayer = { ...who };

        newPlayer.pieces = newPlayer.pieces.filter(
            (playerPiece) => playerPiece.id !== piece.id
        );

        return newPlayer;
    }, []);

    const placePiece = useCallback(
        (props: SearchAlgorithmResponse) => {
            if (!props) return;

            const { chosenPiece, who } = props;

            const newWho = removePieceFromPlayer(chosenPiece.piece, who);

            var newBoardPieces = [...boardPieces];

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
        },
        [boardPieces, removePieceFromPlayer]
    );

    const toggleShift = useCallback(() => {
        if (shift === 'agent') {
            setShift('player');
        } else {
            setShift('agent');
        }
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
        },
        [deck]
    );

    const value = useMemo(
        () => ({
            deck,
            player,
            agent,
            shift,
            boardPieces,
            placePiece,
            start,
            buyPiece,
        }),
        [deck, player, agent, boardPieces, shift, placePiece, start, buyPiece]
    );

    return value;
}
