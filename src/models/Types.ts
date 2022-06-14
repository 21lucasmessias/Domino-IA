export type Value =
    | 0
    | 0.05
    | 0.1
    | 0.25
    | 0.5
    | 1
    | 2
    | 5
    | 10
    | 20
    | 50
    | 100
    | 200;

export type Piece = {
    id: string;
    left: Value;
    right: Value;
    rotated: boolean;
};

export type Location = 'start' | 'end';

export type Player = {
    id: string;
    pieces: Array<Piece>;
    score: number;
};

export type ChosenPiece = {
    piece: Piece;
    location: Location;
};
