import { Flex } from '@chakra-ui/react';

interface BoardProps {}

export function Board({}: BoardProps) {
    return <Flex w="100%" direction={'column'} h="calc(100vh - 170px)"></Flex>;
}
