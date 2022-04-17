import { useState } from 'react';

export default function useSyncState<T>(initialValue: T) {
    const [trait, updateTrait] = useState(initialValue);

    let current = trait;

    const get = () => current;

    const set = (newValue: T) => {
        current = newValue;
        updateTrait(newValue);
        return current;
    };

    return {
        get,
        set,
    };
}
