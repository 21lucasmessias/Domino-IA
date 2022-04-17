import { useCallback, useMemo, useRef, useState } from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Flex,
    useDisclosure,
} from '@chakra-ui/react';
import { SearchAlgorithmResponse } from '../models/Algorithm';
import { ChosenPiece, Location, Piece, Player } from '../models/Types';
import { AgentPieces } from './AgentPieces';
import { Board } from './Board';
import { PlayerPieces } from './PlayerPieces';
interface GameProps {
    agent: Player;
    player: Player;
    boardPieces: Array<Piece>;
    placePiece: (props: SearchAlgorithmResponse) => void;
    shift: string | undefined;
    buyPiece: () => void;
    endOfMatch: boolean;
}

export function Game({
    agent,
    player,
    boardPieces,
    placePiece,
    shift,
    buyPiece,
    endOfMatch,
}: GameProps) {
    const [chosenPieces, setChosenPieces] = useState<Array<ChosenPiece>>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(null);

    const possiblePieces = useMemo(() => {
        const newPossiblePieces: Array<Piece> = [];

        if (boardPieces.length === 0) {
            return newPossiblePieces;
        }

        var [startPiece, endPiece] = [
            boardPieces[0],
            boardPieces[boardPieces.length - 1],
        ];

        if (startPiece.rotated) {
            startPiece = {
                ...startPiece,
                left: startPiece.right,
                right: startPiece.left,
            };
        }

        if (endPiece.rotated) {
            endPiece = {
                ...endPiece,
                left: endPiece.right,
                right: endPiece.left,
            };
        }

        player.pieces.forEach((piece) => {
            if (
                startPiece.left === piece.left ||
                startPiece.left === piece.right
            ) {
                newPossiblePieces.push(piece);
            } else if (
                endPiece.right === piece.left ||
                endPiece.right === piece.right
            ) {
                newPossiblePieces.push(piece);
            }
        });

        return newPossiblePieces;
    }, [boardPieces, player, player.pieces]);

    const handlePlaceClick = (piece: Piece) => {
        var [startPiece, endPiece] = [
            boardPieces[0],
            boardPieces[boardPieces.length - 1],
        ];

        if (startPiece.rotated) {
            startPiece = {
                ...startPiece,
                left: startPiece.right,
                right: startPiece.left,
            };
        }

        if (endPiece.rotated) {
            endPiece = {
                ...endPiece,
                left: endPiece.right,
                right: endPiece.left,
            };
        }

        const newChosenPieces = [];

        if (startPiece.left === piece.right) {
            newChosenPieces.push({
                piece: {
                    ...piece,
                    rotated: false,
                },
                location: 'start',
            });
        }

        if (startPiece.left === piece.left) {
            newChosenPieces.push({
                piece: {
                    ...piece,
                    rotated: true,
                },
                location: 'start',
            });
        }

        if (endPiece.right === piece.left) {
            newChosenPieces.push({
                piece: {
                    ...piece,
                    rotated: false,
                },
                location: 'end',
            });
        }

        if (endPiece.right === piece.right) {
            newChosenPieces.push({
                piece: {
                    ...piece,
                    rotated: true,
                },
                location: 'end',
            });
        }

        onOpen();
        setChosenPieces(newChosenPieces);
    };

    const handlePlacePiece = (location: Location) => {
        if (chosenPieces.length > 0) {
            if (location === 'start') {
                const piece = chosenPieces.find(
                    (piece) => piece.location === 'start'
                );

                if (!piece) return;

                placePiece({
                    chosenPiece: {
                        piece: piece.piece,
                        location,
                    },
                    who: player,
                });
            } else {
                const piece = chosenPieces.find(
                    (piece) => piece.location === 'end'
                );

                if (!piece) return;

                placePiece({
                    chosenPiece: {
                        piece: piece.piece,
                        location,
                    },
                    who: player,
                });
            }
        }

        onClose();
    };

    return (
        <Flex
            w="100%"
            direction={'column'}
            h="calc(100vh - 170px)"
            border="4px solid"
            borderRadius={'2xl'}
            borderColor="blackAlpha.400"
            p={4}
        >
            <AgentPieces player={agent} canPlay={shift === 'agent'} />
            <Board pieces={boardPieces} />
            <PlayerPieces
                possiblePieces={possiblePieces}
                player={player}
                handlePlacePiece={handlePlaceClick}
                canPlay={shift === 'player' && !endOfMatch}
                buyPiece={buyPiece}
                endOfMatch={endOfMatch}
            />

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Jogar
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Onde deseja colocar a peça selecionada?
                        </AlertDialogBody>

                        <AlertDialogFooter justifyContent={'space-between'}>
                            <Button
                                colorScheme="gray"
                                ref={cancelRef}
                                onClick={onClose}
                            >
                                Cancelar
                            </Button>
                            <Flex>
                                <Button
                                    colorScheme="green"
                                    onClick={() => handlePlacePiece('start')}
                                    ml={3}
                                    disabled={
                                        !chosenPieces.some(
                                            (piece) =>
                                                piece.location === 'start'
                                        )
                                    }
                                >
                                    Inicio
                                </Button>
                                <Button
                                    colorScheme="green"
                                    onClick={() => handlePlacePiece('end')}
                                    ml={3}
                                    disabled={
                                        !chosenPieces.some(
                                            (piece) => piece.location === 'end'
                                        )
                                    }
                                >
                                    Fim
                                </Button>
                            </Flex>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Flex>
    );
}
