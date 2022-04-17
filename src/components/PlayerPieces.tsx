import { Divider, Flex, Image, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { images } from '../enums/images';
import { Piece, Player } from '../models/Types';

interface PlayerPiecesProps {
    possiblePieces: Array<Piece>;
    player: Player;
    handlePlacePiece: (chosenPiece: Piece) => void;
    canPlay: boolean;
}

export function PlayerPieces({
    possiblePieces,
    player,
    handlePlacePiece,
    canPlay,
}: PlayerPiecesProps) {
    const unplayablePieces = useMemo(() => {
        return player.pieces.filter(
            (piece) => !possiblePieces.some((pPiece) => pPiece.id === piece.id)
        );
    }, [possiblePieces, player, player.pieces]);

    return (
        <Flex w="100%" direction={'column'} gap={2}>
            <Text color="white" textAlign={'center'}>
                Jogador
            </Text>
            <Flex w="100%" justifyContent="center" gap={4}>
                {possiblePieces.map((piece) => (
                    <Flex
                        as={'button'}
                        key={piece.id}
                        backgroundColor="white"
                        gap={1}
                        p={1}
                        w="140px"
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
                        w="140px"
                        h={'100px'}
                        alignItems="center"
                        borderRadius={'2xl'}
                        cursor={'not-allowed'}
                        opacity={0.4}
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

            <Text textAlign={'center'} color="white">
                Pontuação: {player.score}
            </Text>
        </Flex>
    );
}
