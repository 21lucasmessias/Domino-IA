import { Flex, useToast } from '@chakra-ui/react';
import { Header } from './components/Header';
import { useDomino } from './hooks/UseDomino';
import { useMonetaryPieces } from './variations/Monetary';
import { useGreedySearch } from './hooks/UseGreedySearch';
import { Game } from './components/Game';

function App() {
    const toast = useToast();

    const {
        deck,
        player,
        agent,
        shift,
        boardPieces,
        placePiece,
        start,
        buyPiece,
        toggleShift,
    } = useDomino({
        useDominoVariation: useMonetaryPieces,
        useSearchAlgorithm: useGreedySearch,
    });

    const handleBuy = () => {
        if (!buyPiece(player)) {
            toast({
                title: 'Bloqueado',
                status: 'error',
                position: 'bottom',
            });

            toggleShift();
        }
    };

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
                <Header start={start} buyPiece={handleBuy} />
                <Game
                    agent={agent}
                    boardPieces={boardPieces}
                    player={player}
                    placePiece={placePiece}
                    shift={shift}
                />
            </Flex>
        </Flex>
    );
}

export default App;
