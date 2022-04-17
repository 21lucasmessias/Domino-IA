import { Button, Flex, Heading } from '@chakra-ui/react';

interface HeaderProps {
    start: () => void;
    startAgain: () => void;
}

export function Header({ start, startAgain }: HeaderProps) {
    return (
        <Flex direction={'column'} w="100%" gap={4}>
            <Heading color={'white'}>Domino monetário</Heading>

            <Flex flex={1} justifyContent="space-between" w="100%" gap={4}>
                <Button colorScheme={'gray'} onClick={start}>
                    Reiniciar
                </Button>
                <Button colorScheme={'green'} onClick={startAgain}>
                    Próxima partida
                </Button>
            </Flex>
        </Flex>
    );
}
