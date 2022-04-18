import { Button, Divider, Flex, Image, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { images } from '../enums/images';
import { Piece, Player } from '../models/Types';

interface PlayerPiecesProps {
    possiblePieces: Array<Piece>;
    player: Player;
    handlePlacePiece: (chosenPiece: Piece) => void;
    canPlay: boolean;
    buyPiece: () => void;
    endOfMatch: boolean;
}

export function PlayerPieces({
    possiblePieces,
    player,
    handlePlacePiece,
    canPlay,
    buyPiece,
    endOfMatch,
}: PlayerPiecesProps) {
    const unplayablePieces = useMemo(() => {
        return player.pieces.filter(
            (piece) => !possiblePieces.some((pPiece) => pPiece.id === piece.id)
        );
    }, [possiblePieces, player, player.pieces]);

    return (
        <Flex
            w="100%"
            direction={'column'}
            gap={2}
            borderTop="2px solid"
            pt={4}
            borderColor="blackAlpha.400"
        >
            <Flex justifyContent={'space-between'}>
                <Text color="white">Pontuação: {player.score}</Text>
                <Text color="white" textAlign={'center'}>
                    Jogador
                </Text>
                <Button
                    colorScheme={'purple'}
                    onClick={buyPiece}
                    maxW="100px"
                    alignSelf={'center'}
                    disabled={endOfMatch}
                >
                    Comprar
                </Button>
            </Flex>

            <Flex gap={4} overflowX="auto" py={4} mx="auto" maxW="100%">
                {possiblePieces.map((piece) => (
                    <Flex
                        as={'button'}
                        key={piece.id}
                        backgroundColor="white"
                        gap={1}
                        p={1}
                        minW="220px"
                        h={'100px'}
                        alignItems="center"
                        borderRadius={'2xl'}
                        onClick={() => {
                            handlePlacePiece(piece);
                        }}
                        cursor={canPlay ? 'pointer' : 'not-allowed'}
                        disabled={!canPlay}
                        opacity={canPlay ? 1 : 0.4}
                    >
                        <Flex flex={1} justifyContent="center">
                            <Image src={images.get(piece.left)} maxH="90px" />
                        </Flex>

                        <Divider orientation="vertical" size="2" />

                        <Flex flex={1} justifyContent="center">
                            <Image
                                src={images.get(piece.right)}
                                maxH="90px"
                                justifySelf={'center'}
                            />
                        </Flex>
                    </Flex>
                ))}
                {unplayablePieces.map((piece) => (
                    <Flex
                        key={piece.id}
                        backgroundColor="white"
                        gap={1}
                        p={1}
                        minW="220px"
                        h={'100px'}
                        alignItems="center"
                        borderRadius={'2xl'}
                        cursor={'not-allowed'}
                        opacity={0.5}
                    >
                        <Flex flex={1} justifyContent="center">
                            <Image src={images.get(piece.left)} maxH="90px" />
                        </Flex>

                        <Divider orientation="vertical" size="2" />

                        <Flex flex={1} justifyContent="center">
                            <Image
                                src={images.get(piece.right)}
                                maxH="90px"
                                justifySelf={'center'}
                            />
                        </Flex>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    );
}
