
module bool {
  export type Input = number | boolean;
  export const enum Format {
    /**Word(Yes,No) */
    W,
    /**word(yes,no) */
    w,
    /**Char(Y,N) */
    C,
    /**char(y,n) */
    c,
    /**Icon */
    i,
    /**Check icon se true e não vazio */
    y
  }
  export function get(value: Input, format?) {
    if (value)
      return 'Sim';
    return 'Não'
  }
}
export=bool