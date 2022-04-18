import { Divider, Flex, Image, Text } from '@chakra-ui/react';
import { images } from '../enums/images';
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
            <Flex gap={4} overflowX="auto" py={4} mx="auto" maxW="100%">
                {pieces.map((piece) => (
                    <Flex
                        key={piece.id}
                        backgroundColor="white"
                        gap={1}
                        minW="220px"
                        h={'100px'}
                        alignItems="center"
                        borderRadius={'2xl'}
                        transform={
                            piece.rotated ? 'rotate(180deg)' : 'transform(0deg)'
                        }
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
