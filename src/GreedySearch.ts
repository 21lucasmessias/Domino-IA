import { useMemo } from 'react';
import {
    SearchAlgorithm,
    SearchAlgorithmProps,
    SearchAlgorithmResponse,
} from './App';

export const useGreedySearch: (
    props: SearchAlgorithmProps
) => SearchAlgorithm = ({ agent, boardPieces }) => {
    const execute = (): SearchAlgorithmResponse => {
        return {
            piece: {
                id: '1',
                left: 0.05,
                right: 0.1,
            },
            location: 'end',
            who: agent,
        };
    };

    const value = useMemo(() => {
        return {
            execute,
        };
    }, [execute]);

    return value;
};
