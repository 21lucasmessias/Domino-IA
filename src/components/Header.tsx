import { Button, Flex, Heading } from '@chakra-ui/react';

interface HeaderProps {
    start: () => void;
    startAgain: () => void;
    endOfGame: boolean;
}

export function Header({ start, startAgain, endOfGame }: HeaderProps) {
    return (
        <Flex direction={'column'} w="100%" gap={4}>
            <Heading color={'white'}>Domino monetário</Heading>

            <Flex flex={1} justifyContent="space-between" w="100%" gap={4}>
                <Button colorScheme={'gray'} onClick={start}>
                    Iniciar
                </Button>
                <Button
                    colorScheme={'green'}
                    onClick={startAgain}
                    disabled={!endOfGame}
                >
                    Jogar novamente
                </Button>
            </Flex>
        </Flex>
    );
}
