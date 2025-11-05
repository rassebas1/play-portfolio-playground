import { useRef } from "react";

export const useIds = () => {
    const nextId = useRef(0);

    const getNextId = () => {
        const newId = nextId.current;
        nextId.current += 1;

        return newId.toString();
    };

    return [getNextId];
};