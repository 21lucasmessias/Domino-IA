import { useRef, useState } from 'react';
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
import { Location, Piece, Player } from '../models/Types';
import { AgentPieces } from './AgentPieces';
import { Board } from './Board';
import { PlayerPieces } from './PlayerPieces';

interface GameProps {
    agent: Player;
    player: Player;
    boardPieces: Array<Piece>;
    placePiece: (props: SearchAlgorithmResponse) => void;
}

export function Game({ agent, player, boardPieces, placePiece }: GameProps) {
    const [piece, setPiece] = useState<Piece | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(null);

    const handlePlaceClick = (piece: Piece) => {
        onOpen();
        setPiece(piece);
    };

    const handlePlacePiece = (location: Location) => {
        if (piece) {
            placePiece({ location: location, piece: piece, who: player });
        }

        onClose();
    };

    return (
        <Flex w="100%" direction={'column'} h="calc(100vh - 170px)">
            <AgentPieces player={agent} />
            <Board pieces={boardPieces} />
            <PlayerPieces player={player} handlePlacePiece={handlePlaceClick} />

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
                            Aonde deseja colocar a peça selecionada?
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
                                >
                                    Inicio
                                </Button>
                                <Button
                                    colorScheme="green"
                                    onClick={() => handlePlacePiece('end')}
                                    ml={3}
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
