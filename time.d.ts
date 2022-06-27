export declare class Time {
    v: Date;
    constructor(v: Date);
    minute(): number;
    minute(value: number): this;
    second(): number;
    second(value: number): this;
    hour(): number;
    hour(value: number): this;
    addHour(value: number): this;
    day(): number;
    day(value: number): this;
    addDay(value: number): this;
    addYear(value: number): this;
    addMonth(value: number): this;
    weekStart(): this;
    fromNow(format?: string): void;
    clone(): Time;
    subtract(): void;
    diff(input: Time, period?: PeriodType): number;
    add(value: number): this;
    equal(other: Time): boolean;
    equalDate(Input: any): boolean;
    equalTime(Input: any): boolean;
    /**
     * retorna a diferença de tempo
     * agora
  hoje
  ontem
  esta semana
  semana passadas
  este mes
  mes passado
  simestre passado
  este ano
  ano passado */
    age(): string;
    toJSON(): string;
    toString(): string;
    valueOf(): number;
}
export declare function lastday(t: Date): number;
export declare function year(t: Date): number;
export declare function year(t: Date, value: number): Date;
/**get month */
export declare function month(t: Date): number;
/**set month */
export declare function month(t: Date, value: number): Date;
export declare function toInput(t: Time, type: InputType): string;
/**
 * format
 * @param pattern
 * @param def
 */
export declare function formatTime(t: Date | Time, pattern?: string, def?: string): string;
export declare const toDB: (t: Time | Date) => string;
export declare const enum TimerUnit {
    milesecund = "z",
    second = "s",
    minute = "m",
    hour = "h",
    day = "d",
    month = "M",
    year = "y"
}
export declare function getTime(date: Date): string;
export declare function store(input: HTMLInputElement): string;
export declare function check(input: Time): Time;
export declare function now(): Time;
declare type Key = string | number;
interface TimeOption {
    /**year */
    y?: Key;
    /**Month */
    M?: Key;
    /**day */
    d?: Key;
    /**year */
    h?: Key;
    /**year */
    m?: Key;
    /**year */
    s?: Key;
}
export declare type Input = string | Date | Time | number | TimeOption;
export declare type InputType = 'time' | 'date' | 'datetime-local' | 'week' | 'month';
export declare const fullFormat = "yyyy-MM-dd hh:mm:ss";
export declare const defaultFormat = "dd-MM-yyyy hh:mm";
export declare const formatRegex: RegExp;
export declare const quickformat: {
    lt: string;
    l: string;
    f: string;
    d: string;
    t: string;
};
export declare const enum PeriodType {
    z = 0.1,
    s = 1,
    m = 60,
    h = 3600,
    d = 86400,
    w = 604800,
    y = 31556736,
    /**quinzena */
    f = 1314864,
    /**mês */
    M = 2629728,
    M2 = 5259456,
    M3 = 7889184,
    M4 = 10518912,
    M6 = 15778368
}
export declare class Period {
    constructor(begin: Input, end: Input);
    constructor(date: Input, type: PeriodType);
    format(format?: string): string;
}
export {};
