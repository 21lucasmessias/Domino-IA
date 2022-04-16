import { Button, Flex, Heading } from '@chakra-ui/react';

interface HeaderProps {
    execute: () => void;
}

export function Header({ execute }: HeaderProps) {
    return (
        <Flex direction={'column'} w="100%" gap={4}>
            <Heading color={'white'}>Domino monetário</Heading>

            <Flex flex={1} alignItems="flex-end" direction={'column'}>
                <Button colorScheme={'purple'} onClick={execute}>
                    Reiniciar
                </Button>
            </Flex>
        </Flex>
    );
}
