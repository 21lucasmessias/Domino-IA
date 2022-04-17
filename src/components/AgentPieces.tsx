import { Flex, Text } from '@chakra-ui/react';
import { Player } from '../models/Types';

interface AgentPiecesProps {
    player: Player;
    canPlay: boolean;
}

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
            <Flex w="100%" justifyContent="center" gap={4}>
                {player.pieces.map((piece) => (
                    <Flex
                        key={piece.id}
                        backgroundColor="white"
                        gap={1}
                        p={1}
                        w="40px"
                        h={'60px'}
                        alignItems="center"
                        borderRadius={'2xl'}
                        opacity={canPlay ? 1 : 0.4}
                    />
                ))}
            </Flex>
        </Flex>
    );
}
