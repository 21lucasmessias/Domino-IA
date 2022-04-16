import { Flex } from '@chakra-ui/react';
import { Board } from './components/Board';
import { Header } from './components/Header';
import { useDomino } from './Domino';
import { useGreedySearch } from './GreedySearch';
import { Location, Piece, Player } from './models/Types';
import { useMonetaryPieces } from './variations/Monetary';

export interface SearchAlgorithmProps {
    agent: Player;
    boardPieces: Array<Piece>;
    placePiece: (piece: Piece, location: Location) => void;
}

export type SearchAlgorithmResponse = {
    piece: Piece;
    where: Location;
};

export interface SearchAlgorithm {
    execute: () => SearchAlgorithmResponse;
}

function App() {
    const {
        deck,
        player,
        agent,
        boardPieces,
        placePiece,
        start,
        getStartingPlayer,
    } = useDomino(useMonetaryPieces);

    const { execute } = useGreedySearch({ agent, boardPieces, placePiece });

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
