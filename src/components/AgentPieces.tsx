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
        <Flex
            w="100%"
            direction={'column'}
            gap={2}
            borderBottom="2px solid"
            pb={4}
            borderColor="blackAlpha.400"
        >
            <Flex>
                <Text color="white" position="absolute">
                    Pontuação: {player.score}
                </Text>
                <Text color="white" textAlign={'center'} w="100%">
                    Máquina
                </Text>
            </Flex>
            <Flex gap={4} overflowX="auto" py={4} mx="auto" maxW="100%">
                {player.pieces.map((piece) => (
                    <Flex
                        key={piece.id}
                        backgroundColor="white"
                        gap={1}
                        p={1}
                        minW={visible ? '220px' : '60px'}
                        h={visible ? '100px' : '80px'}
                        alignItems="center"
                        borderRadius={'2xl'}
                        opacity={canPlay ? 1 : 0.4}
                    >
                        {visible && (
                            <>
                                <Flex flex={1} justifyContent="center">
                                    <Image
                                        src={images.get(piece.left)}
                                        maxH="90px"
                                    />
                                </Flex>
                                <Divider orientation="vertical" size="2" />
                                <Flex flex={1} justifyContent="center">
                                    <Image
                                        src={images.get(piece.right)}
                                        maxH="90px"
                                        justifySelf={'center'}
                                    />
                                </Flex>
                            </>
                        )}
                    </Flex>
                ))}
            </Flex>
        </Flex>
    );
}
