export type Value =
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
    id: String;
    left: Value;
    right: Value;
};

export type Location = 'start' | 'end';

export type Player = {
    pieces: Array<Piece>;
    score: Number;
};
