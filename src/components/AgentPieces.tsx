import { Divider, Flex, Image, Text } from '@chakra-ui/react';
import { images } from '../enums/images';
import { Player } from '../models/Types';

interface AgentPiecesProps {
    player: Player;
    canPlay: boolean;
}

const visible = true;

export function AgentPieces({ player, canPlay }: AgentPiecesProps) {
    return (
        <Flex w="100%" direction={'column'} gap={2}>
            <Text color="white" textAlign={'center'}>
                Máquina
            </Text>
            <Flex w="100%" justifyContent="center" gap={4}>
                {player.pieces.map((piece) => (
                    <Flex
                        key={piece.id}
                        backgroundColor="white"
                        gap={1}
                        p={1}
                        w="140px"
                        h={'100px'}
                        alignItems="center"
                        borderRadius={'2xl'}
                        opacity={canPlay ? 1 : 0.4}
                    >
                        <Flex flex={1} justifyContent="center">
                            {visible && (
                                <Image
                                    src={images.get(piece.left)}
                                    maxH="90px"
                                />
                            )}
                        </Flex>
                        <Divider orientation="vertical" size="2" />
                        <Flex flex={1} justifyContent="center">
                            {visible && (
                                <Image
                                    src={images.get(piece.right)}
                                    maxH="90px"
                                    justifySelf={'center'}
                                />
                            )}
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
