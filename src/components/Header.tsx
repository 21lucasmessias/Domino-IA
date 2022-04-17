import { Button, Flex, Heading } from '@chakra-ui/react';
import { Player } from '../models/Types';

interface HeaderProps {
    start: () => void;
    buyPiece: () => void;
}

export function Header({ start, buyPiece }: HeaderProps) {
    return (
        <Flex direction={'column'} w="100%" gap={4}>
            <Heading color={'white'}>Domino monetário</Heading>

            <Flex flex={1} justifyContent="flex-end" w="100%" gap={4}>
                <Button colorScheme={'purple'} onClick={buyPiece}>
                    Comprar
                </Button>
                <Button colorScheme={'purple'} onClick={start}>
                    Reiniciar
                </Button>
            </Flex>
        </Flex>
    );
}
