
function time(input = new Date()) {
  return new time.Time(input);
}
module time {

  export class Time {

    constructor(public v: Date) { }

    get valid() { return this.v != null || isNaN(<any>this.v); }
    /**
     * format
     * @param pattern
     * @param def
     */
    fmt(pattern?: string, def?: string) {
      let i = this.v;
      if (!i) return '';
      if (pattern in time.quickformat)
        pattern = time.quickformat[pattern];
      if (this.valid)
        return (pattern || time.defaultFormat).replace(time.formatRegex, (sub): any => {
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

    toDB() {
      return this.fmt('yyyy-MM-dd HH:mm:ss')
    }

    lastday(): number {
      return new Date(this.year(), this.month(), 0).getDate();
    }

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

    year(): number;
    year(value: number): this;
    year(value?: number) {
      if (value == null)
        return this.v.getFullYear();
      this.v.setFullYear(value);
      return this;
    }

    addYear(value: number) {
      this.v.setFullYear(this.v.getFullYear() + value);
      return this;
    }
    /**get month */
    month(): number;
    /**set month */
    month(value: number): this;
    month(value?: number) {
      if (value == null)
        return this.v.getMonth() + 1;
      this.v.setMonth(value - 1);
      return this;
    }
    addMonth(value: number) {
      this.v.setMonth(this.v.getMonth() + value);
      return this;
    }

    weekStart() {
      return this.addDay(-this.v.getDay());
    }

    toInput(type: time.InputType) {
      if (!this.valid) return null;
      switch (type) {
        case 'date':
          return this.fmt('yyyy-MM-dd');
        case 'datetime-local':
          return this.fmt('yyyy-MM-ddThh:mm');
        case 'month':
          return this.fmt('yyyy-MM');
        case 'time':
          return this.fmt('hh:mm');
        case 'week':
          return this.fmt('yyyy-[W]ww');
        default:
          throw "unsetted24";
      }
    }
    fromNow(format?: string) {
      ///*2 anos*/'Y' |/*2*/'N' |/*2 anos e 3 meses*/'M' |/*2 anos; 3 meses*/'m'
    }
    clone() { return new Time(new Date(this.v.getTime())); }
    subtract() {

    }
    diff(input: Time, period: time.PeriodType = time.PeriodType.d) {
      let span = this.v.getTime() - input.v.getTime();
      return Math.floor(span / (period * 1000));
    }
    add(value: number) {
      this.v.setMilliseconds(this.v.getMilliseconds() + value);
      return this;
    }
    equal(other: Time) {
      if (!this.valid || !other.valid)
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
    toJSON() { return this.fmt(time.fullFormat); }
    toString() {
      return this.fmt();
    }
    valueOf() {
      return this.v.valueOf();
    }
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
        return new Time(input.valueAsDate).fmt('yyyy-MM-dd');
    }
  }


  const checkFormats = [
    ///^(<d>\d{2})-(<M>\d{2})-(<y>\d{4})$/,
    ///^(?<h>\d{2}):(?<m>\d{2})(?::(?<s>\d{2}))$/,
  ];
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
  export function fromT(input: string) {
    if (!input) return new Time(null);
    let data = new Date(input);
    if (isNaN(<any>data) && timeRegex.test(input)) {
      data = new Date('0000-01-01 ' + input);
    }
    return new Time(data);
  }
  export function create(input: unknown): Time {
    if (input == null || input instanceof Date)
      return new Time(<Date>input);
    if (input instanceof Time)
      return input;
    else if (typeof input == 'string')
      return fromT(input);
    else if (typeof input == 'number')
      return new Time(new Date(input))
    //if (input) {
    //  if (input['__proto__'] == Object.prototype)
    //    throw "not implemented";

    //  this.input = inputValue(input);
    //} else if (!arguments.length)
    //  this.input = new Date();
    //else this.input = null;
    //if (!arguments.length)
    //  return new time.Time();
    //return new time.Time(input, format);
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
  export const timeRegex = /\d{2}:\d{2}:\d{2}/;
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

  export enum PeriodType {
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
}

export = time;