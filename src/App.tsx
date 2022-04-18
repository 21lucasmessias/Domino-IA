import { Flex, useToast } from '@chakra-ui/react';
import { Header } from './components/Header';
import { useDomino } from './hooks/UseDomino';
import { useMonetaryPieces } from './variations/Monetary';
import { useGreedySearch } from './hooks/UseGreedySearch';
import { Game } from './components/Game';
import { useAStarSearch } from './hooks/UseAStarSearch';

function App() {
    const toast = useToast();

    const {
        deck,
        player,
        agent,
        shift,
        boardPieces,
        endOfMatch,
        endOfGame,
        placePiece,
        start,
        buyPiece,
        toggleShift,
    } = useDomino({
        useDominoVariation: useMonetaryPieces,
        useSearchAlgorithm: useAStarSearch,
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
            backgroundColor="blue.800"
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
                <Header
                    start={start}
                    startAgain={() => {
                        start(agent, player);
                    }}
                    endOfGame={endOfGame}
                />
                <Game
                    buyPiece={handleBuy}
                    agent={agent}
                    boardPieces={boardPieces}
                    player={player}
                    placePiece={placePiece}
                    shift={shift}
                    endOfMatch={endOfMatch}
                />
            </Flex>
        </Flex>
    );
}

export default App;
