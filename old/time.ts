
// export default function time(input: Date | string = new Date()) {
//   return typeof input == "string" ? fromT(input) : new Time(input);
// }
export class Time {

  constructor(public v: Date) { }





  minute(): number;
  minute(value: number): this;
  minute(value?: number) {
    if (value == null)
      return this.v.getMinutes();
    this.v.setMinutes(value);
    return this;
  }

  second(): number;
  second(value: number): this;
  second(value?: number) {
    if (value == null)
      return this.v.getSeconds();
    this.v.setSeconds(value);
    return this;
  }
  hour(): number;
  hour(value: number): this;
  hour(value?: number) {
    if (value == null)
      return this.v.getHours();
    this.v.setHours(value);
    return this;
  }

  addHour(value: number) {
    this.v.setHours(this.v.getHours() + value);
    return this;
  }
  day(): number;
  day(value: number): this;
  day(value?: number) {
    if (value == null)
      return this.v.getDate();
    this.v.setDate(value);
    return this;
  }
  addDay(value: number) {
    this.v.setDate(this.v.getDate() + value);
    return this;
  }


  addYear(value: number) {
    this.v.setFullYear(this.v.getFullYear() + value);
    return this;
  }
  addMonth(value: number) {
    this.v.setMonth(this.v.getMonth() + value);
    return this;
  }

  weekStart() {
    return this.addDay(-this.v.getDay());
  }

  fromNow(format?: string) {
    ///*2 anos*/'Y' |/*2*/'N' |/*2 anos e 3 meses*/'M' |/*2 anos; 3 meses*/'m'
  }
  clone() { return new Time(new Date(this.v.getTime())); }
  subtract() {

  }
  diff(input: Time, period: PeriodType = PeriodType.d) {
    let span = this.v.getTime() - input.v.getTime();
    return Math.floor(span / (period * 1000));
  }
  add(value: number) {
    this.v.setMilliseconds(this.v.getMilliseconds() + value);
    return this;
  }
  equal(other: Time) {
    if (!valid(this.v) || !valid(other.v))
      return other.v == this.v;

    return this.valueOf() == other.valueOf();
  }
  equalDate(Input) {
    return true;
  }
  equalTime(Input) {
    return true;
  }
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
  age() {
    return "";
  }
  toJSON() { return formatTime(this, fullFormat); }
  toString() {
    return formatTime(this);
  }
  valueOf() {
    return this.v.valueOf();
  }
}

export function lastday(t: Date): number {
  return new Date(year(t), month(t), 0).getDate();
}
export function year(t: Date): number;
export function year(t: Date, value: number): Date;
export function year(t: Date, value?: number) {
  if (value == null)
    return t.getFullYear();
  t.setFullYear(value);
  return t;
}
/**get month */
export function month(t: Date): number;
/**set month */
export function month(t: Date, value: number): Date;
export function month(t: Date, value?: number) {
  if (value == null)
    return t.getMonth() + 1;
  t.setMonth(value - 1);
  return t;
}
function valid(t: Date) { return t != null || isNaN(<any>t); }
export function toInput(t: Time, type: InputType) {
  if (!valid(t.v)) return null;
  switch (type) {
    case 'date':
      return formatTime(t, 'yyyy-MM-dd');
    case 'datetime-local':
      return formatTime(t, 'yyyy-MM-ddThh:mm');
    case 'month':
      return formatTime(t, 'yyyy-MM');
    case 'time':
      return formatTime(t, 'hh:mm');
    case 'week':
      return formatTime(t, 'yyyy-[W]ww');
    default:
      throw "unsetted24";
  }
}
/**
 * format
 * @param pattern
 * @param def
 */
export function formatTime(t: Date | Time, pattern?: string, def?: string) {

  let i = t instanceof Date ? t : t.v;
  if (!i) return '';
  if (pattern in quickformat)
    pattern = quickformat[pattern];
  if (valid(i))
    return (pattern || defaultFormat).replace(formatRegex, (sub): any => {
      switch (sub) {
        case 'yyyy':
          return i.getFullYear();

        case 'ss':
          return (i.getSeconds() + '').padStart(2, '0');
        case 's':
          return i.getSeconds();

        case 'mm':
          return (i.getMinutes() + '').padStart(2, '0');
        case 'm':
          return i.getMinutes();

        case 'HH':
        case 'hh':
          return (i.getHours() + '').padStart(2, '0');
        case 'h':
          return i.getHours();


        case 'dd':
          return (i.getDate() + '').padStart(2, '0');
        case 'd':
          return i.getDate();

        case 'MM':
          return ((i.getMonth() + 1) + '').padStart(2, '0');
        case 'M':
          return i.getMonth() + 1;
      }
    });
  else def || '';

  return null;
}
export const toDB = (t: Time | Date) => formatTime(t, 'yyyy-MM-dd HH:mm:ss');
export const enum TimerUnit {
  milesecund = "z",
  second = "s",
  minute = "m",
  hour = "h",
  day = "d",
  month = "M",
  year = "y"
}
export function getTime(date: Date) {
  return `${(date.getHours() + '').padStart(2, '0')}:${(date.getMinutes() + '').padStart(2, '0')}:${(date.getSeconds() + '').padStart(2, '0')}`;
}
export function store(input: HTMLInputElement) {
  switch (input.type) {
    case 'date':
    case 'datetime-local':
      return input.value;
    case 'time':
      return input.value + ':00';

    case 'month':
      return input.value + ':01';
    case 'week':
      return formatTime(new Time(input.valueAsDate), 'yyyy-MM-dd');
  }
}


// const checkFormats = [
//   ///^(<d>\d{2})-(<M>\d{2})-(<y>\d{4})$/,
//   ///^(?<h>\d{2}):(?<m>\d{2})(?::(?<s>\d{2}))$/,
// ];
export function check(input: Time) {

  //if (typeof input === 'string') {
  //  let t: RegExpExecArray & { groups?: TimeOption; };
  //  for (let i = 0; i < checkFormats.length; i++)
  //    if (t = checkFormats[i].exec(input)) {
  //      return new Time(t.groups);
  //    }
  //}

  //se for Date or input return;
  if ((input instanceof Date && (input = new Time(input))) ||
    input instanceof Time ||
    (input && typeof input == 'object' && (input = new Time(input))))
    return input;

  return null;
}
export function now() {
  return new Time(new Date());
}

type Key = string | number;
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
export type Input = string | Date | Time | number | TimeOption;

export type InputType = 'time' | 'date' | 'datetime-local' | 'week' | 'month';

export const fullFormat = 'yyyy-MM-dd hh:mm:ss'; //'yyyy-MM-dd hh:mm:ss';
export const defaultFormat = 'dd-MM-yyyy hh:mm'; //'yyyy-MM-dd hh:mm:ss';
export const formatRegex = /(LT|y{2,4}|M{1,4}|d{1,2}|H{1,2}|h{1,2}|m{1,2}|s{1,2})/g;

export const quickformat = {
  //deprecate
  lt: 'dd-MM-yyyy hh:mm',
  //deprecate
  l: 'dd-MM-yyyy',

  f: 'dd-MM-yyyy hh:mm',
  d: 'dd-MM-yyyy',
  t: 'hh:mm'
};
function inputValue(input?: Input) {
  return new Date(input instanceof Time ? input.v : <any>input);
}

export const enum PeriodType {
  ///**miliseconds */
  z = 0.1,
  s = 1,
  m = s * 60,
  h = m * 60,
  d = h * 24,
  w = d * 7,
  y = d * 365.24,//2
  /**quinzena */
  f = y / 24,
  /**mês */
  M = y / 12,
  M2 = y / 6,
  M3 = y / 4,
  M4 = y / 3,
  M6 = y / 2,
}
export class Period {
  constructor(begin: Input, end: Input);
  constructor(date: Input, type: PeriodType);
  constructor(begin: Input, end: Input | PeriodType) {

  }

  format(format?: string) {
    return "";
  }
}