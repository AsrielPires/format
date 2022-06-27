interface Dic<T = any> {
    [key: string]: T;
}
/** */
export declare const emailRegex: RegExp;
/**
 * check if a value is a valid email;
 * @param value
 */
export declare function isEmail(value: string): boolean;
/**
 * pesquisa dentro da segunda string a primeira;
 * @param pattern
 * @param text
 */
export declare function match(pattern: string, text: any): boolean;
/**
 * md
 * @param str
 */
export declare function build(str: string): void;
export declare type Input = string | Text;
export declare class Text {
    input: string;
    constructor(input: Input);
    format(format: string): string;
}
export interface PhraseParam {
    value(value: string): string;
}
export declare type TextCase = 'U' | 'L' | 'S' | 'C';
export declare type TextStyle = 'B' | 'b' | 'N' | 'n' | 'T';
export declare type TextSize = 'P' | 'p' | 'H';
export declare function format(str: string, params: Dic): string;
export declare function process(str: string, params: (text: string) => any): any[];
export interface TextFormatOptions {
}
/**
* recebe um pattern e gera uma string usando os parametros
* @param pattern string a substituier ex:(a soma é:{sum})
* @param params
*/
export declare function htmlTextFormat(pattern: string, params: Dic, options?: TextFormatOptions): void;
export {};
