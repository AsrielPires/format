export declare type Input = number | boolean;
export declare const enum Format {
    /**Word(Yes,No) */
    W = 0,
    /**word(yes,no) */
    w = 1,
    /**Char(Y,N) */
    C = 2,
    /**char(y,n) */
    c = 3,
    /**Icon */
    i = 4,
    /**Check icon se true e não vazio */
    y = 5
}
export declare function get(value: Input, format?: any): "Sim" | "Não";
