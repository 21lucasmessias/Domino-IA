import { Flex } from '@chakra-ui/react';
import { Piece, Player } from '../models/Types';
import { AgentPieces } from './AgentPieces';
import { Board } from './Board';
import { PlayerPieces } from './PlayerPieces';

interface GameProps {
    agent: Player;
    player: Player;
    boardPieces: Array<Piece>;
}

export function Game({ agent, player, boardPieces }: GameProps) {
    return (
        <Flex w="100%" direction={'column'} h="calc(100vh - 170px)">
            <AgentPieces player={agent} />
            <Board pieces={boardPieces} />
            <PlayerPieces player={player} />
        </Flex>
    );
}
