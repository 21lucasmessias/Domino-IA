import { Flex } from '@chakra-ui/react';
import { Board } from './components/Board';
import { Header } from './components/Header';
import { useDomino } from './Domino';
import { useMonetaryPieces } from './variations/Monetary';
import { useGreedySearch } from './GreedySearch';

function App() {
    const {
        deck,
        player,
        agent,
        boardPieces,
        placePiece,
        start,
        getStartingPlayer,
    } = useDomino({
        useDominoVariation: useMonetaryPieces,
        useSearchAlgorithm: useGreedySearch,
    });

    return (
        <Flex
            w="100%"
            h="100vh"
            direction={'column'}
            backgroundColor="#181A1B"
            overflow="hidden"
        >
            <Flex
                maxW={['100%', '100%', '720px', '1080px']}
                mx="auto"
                direction="column"
                gap={4}
                p={4}
                overflow="hidden"
                w="100%"
            >
                <Header start={start} />
                <Board />
            </Flex>
        </Flex>
    );
}

export default App;
