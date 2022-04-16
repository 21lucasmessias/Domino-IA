import { Flex } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { Board } from './components/Board';
import { Header } from './components/Header';
import { useGreedySearch } from './GreedySearch';

import { Location, Piece, Player } from './models/Types';

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

const useMonetaryPieces = () => {
    const [pieces, setPieces] = useState([]);

    useEffect(() => {}, []);

    return { pieces };
};

function App() {
    const { pieces } = useMonetaryPieces();

    const [agent, setAgent] = useState<Player>({
        pieces: [],
        score: 0,
    });

    const [player, setPlayer] = useState<Player>({
        pieces: [],
        score: 0,
    });

    const [boardPieces, setBoardPieces] = useState<Array<Piece>>([]);

    const placePiece = useCallback(() => {}, [boardPieces, agent]);

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
                <Header execute={execute} />
                <Board />
            </Flex>
        </Flex>
    );
}

export default App;
