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
            <Flex w="100%" justifyContent="center" gap={4}>
                {pieces.map((piece) => (
                    <Flex
                        key={piece.id}
                        backgroundColor="white"
                        gap={1}
                        p={1}
                        w="140px"
                        h={'100px'}
                        alignItems="center"
                        borderRadius={'2xl'}
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
