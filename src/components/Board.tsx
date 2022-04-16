import { Divider, Flex, Text } from '@chakra-ui/react';
import { Piece } from '../models/Types';

interface BoardProps {
    pieces: Array<Piece>;
}

export function Board({ pieces }: BoardProps) {
    return (
        <Flex
            w="100%"
            flex={1}
            justifyContent="center"
            alignItems={'center'}
            gap={4}
        >
            {pieces.map((piece) => (
                <Flex key={piece.id}>
                    <Text>{piece.left}</Text>
                    <Divider />
                    <Text>{piece.right}</Text>
                </Flex>
            ))}
        </Flex>
    );
}
