import { Flex } from '@chakra-ui/react';
import { Header } from './components/Header';
import { useDomino } from './Domino';
import { useMonetaryPieces } from './variations/Monetary';
import { useGreedySearch } from './GreedySearch';
import { Game } from './components/Game';

function App() {
    const {
        deck,
        player,
        agent,
        shift,
        boardPieces,
        placePiece,
        start,
        getStartingPlayer,
        toggleShift,
    } = useDomino({
        useDominoVariation: useMonetaryPieces,
        useSearchAlgorithm: useGreedySearch,
    });

    console.log({ player, agent, boardPieces });

    return (
        <Flex
            w="100%"
            h="100vh"
            direction={'column'}
            backgroundColor="#181A1B"
            overflow="hidden"
        >
            <Flex
                maxW={['100%', '100%', '100%', '1080px', '1680px']}
                mx="auto"
                direction="column"
                gap={4}
                p={4}
                overflow="hidden"
                w="100%"
            >
                <Header start={start} />
                <Game agent={agent} boardPieces={boardPieces} player={player} />
            </Flex>
        </Flex>
    );
}

export default App;
