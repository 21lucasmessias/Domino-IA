import { Button, Flex, Heading } from '@chakra-ui/react';

interface HeaderProps {
    start: () => void;
}

export function Header({ start }: HeaderProps) {
    return (
        <Flex direction={'column'} w="100%" gap={4}>
            <Heading color={'white'}>Domino monetário</Heading>

            <Flex flex={1} alignItems="flex-end" direction={'column'}>
                <Button colorScheme={'purple'} onClick={start}>
                    Reiniciar
                </Button>
            </Flex>
        </Flex>
    );
}
