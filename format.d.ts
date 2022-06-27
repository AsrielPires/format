import { Input as timeInput } from "./time.js";
import { InFullUnit, Input as scalarInput } from "./scalar.js";
export declare function timeFromStr(input: string): Date;
export declare function time(input?: unknown): Date;
declare type str = string;
interface Dic<T = any> {
    [key: string]: T;
}
interface Locale {
    inFull: InFullUnit[];
}
export declare let locale: Locale;
export declare let locales: Dic<Locale>;
export declare function setLang(value: str | str[]): void;
export declare function setLang(key: string, locale: Locale): void;
export declare type AcceptFormatValue = Date | timeInput | scalarInput | number | string;
/**
 *
 * @param value
 * @param exp format(t;format;if null)
 */
export declare type ValueType = 's' | 'd' | 'b' | 'n';
/**
 * format un number,string,date, time date-time,enumerator or boolean
 * @param value
 * @param exp
 * @param opts
 */
export default function format(value: AcceptFormatValue, exp: string, opts?: Dic): any;
export default function format(value: AcceptFormatValue, exp: string, tp?: ValueType): any;
export {};
