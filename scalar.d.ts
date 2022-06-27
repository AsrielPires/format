declare type num = number;
declare type str = string;
interface Dic<T = any> {
    [key: string]: T;
}
/**
 *
 * @param input
 */
export default function scalar(input: Input): Scalar;
/**
 *
 * @param input
 * @param format
 */
export default function scalar(input: Input, format: str): Scalar;
export interface Currency {
    id?: num;
    code: str;
    symbol?: str;
    name?: str;
    value: num;
}
export declare function reverseFormat(input: str, format: str): number;
export declare const inFull: InFullUnit[];
export declare function len(value: num): number;
export declare function check(input: Input): Scalar;
export declare type Input = str | num | Scalar;
export declare function value(input: Input): number;
export declare const enum Transform {
    romanize = "i",
    letter = "a",
    timer = "t",
    inFull = "f"
}
export declare const enum SingleFormat {
    N = "N",
    /** */
    D = "D",
    /**Percentage */
    P = "%",
    /**Notação cientifica */
    E = "E",
    /**Currency */
    C = "$"
}
export interface Locale {
    sub: {
        [index: number]: any;
    };
}
export declare const defaultLocale: Locale;
export declare function checknum(value: num, exp: num): number;
export declare class Scalar {
    /** */
    value: num;
    constructor(input: Input, format?: str);
    add(input: Input): Scalar;
    sub(input: Input): Scalar;
    time(input: Input): Scalar;
    div(input: Input): Scalar;
    fmt(format?: str | Transform | SingleFormat, opts?: Dic): str;
    transform(format: Transform, opts?: Dic): string;
    get valid(): boolean;
}
export interface InFullOptions {
    /**gender */
    g: 'f' | 'm';
    /**next */
    n?: str;
    c(value: num, opts: InFullOptions, i?: num): str;
    /**single unit */
    s?: str;
    /**single unit */
    p?: str;
    /**decimal single unit*/
    ds?: str;
    /**decimal plural unit*/
    dp?: str;
}
export interface InFullUnit {
    v: num;
    exp(value?: num, opts?: InFullOptions, i?: num): str;
}
interface Settings {
    null?: str;
    zero?: str;
    currencies?: Currency[];
    currency?: str;
}
export declare const $: Settings;
export {};
