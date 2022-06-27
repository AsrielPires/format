import { Input as timeInput, formatTime } from "./time.js";
import scalar, { InFullUnit, inFull, Input as scalarInput } from "./scalar.js";

const timeRegex = /\d{2}:\d{2}:\d{2}/;
export function timeFromStr(input: string) {
  if (!input) null;
  let data = new Date(input);
  if (isNaN(<any>data) && timeRegex.test(input)) {
    data = new Date('0000-01-01 ' + input);
  }
  return data;
}
export function time(input?: unknown): Date {
  switch (typeof input) {
    case "string":
      return timeFromStr(input);
    case "number":
      return new Date(input);
    case "undefined":
      return new Date();
    default:
      return <Date>input;
  }
}
type str = string;

interface Dic<T = any> { [key: string]: T; }
interface Locale {
  inFull: InFullUnit[]
}
export let locale: Locale;
export let locales: Dic<Locale> = {};

export function setLocale(value: str | str[]) {
  for (let key of (typeof value === 'string' ? [value] : value))
    if (key in locales) {
      locale = locales[key];
      inFull.splice(0, inFull.length, ...locale.inFull);
      return;
    }
  throw `locale(s) '${value}' not found`;
}
export function addLocale(key: string, locale: Locale) {
  //if (locale.scalar) {
  //  let f = locale.inFull;
  //  if (f)
  //    for (let i = 0; i < f.length; i++) {
  //      let t = f[i];
  //      if (typeof t.exp == 'string') {
  //        let v = t.exp;
  //        f[i].exp = () => v;
  //      }
  //    }
  //}
  locales[key] = locale;
}
addLocale('pt', {
  inFull: [
    { v: 0, exp: () => 'zero' },

    { v: 1, exp: (_, o) => o.g == 'f' ? 'uma' : 'um' },
    { v: 2, exp: (_, o) => o.g == 'f' ? 'duas' : 'dois' },
    { v: 3, exp: () => 'três' },
    { v: 4, exp: () => 'quatro' },
    { v: 5, exp: () => 'cinco' },
    { v: 6, exp: () => 'seis' },
    { v: 7, exp: () => 'sete' },
    { v: 8, exp: () => 'oito' },
    { v: 9, exp: () => 'nove' },

    { v: 10, exp: () => 'dez' },
    { v: 11, exp: () => 'onze' },
    { v: 12, exp: () => 'doze' },
    { v: 13, exp: () => 'treze' },
    { v: 14, exp: () => 'quatorze' },
    { v: 15, exp: () => 'quinze' },
    { v: 16, exp: () => 'dezasseis' },
    { v: 17, exp: () => 'dezassete' },
    { v: 18, exp: () => 'dezoito' },
    { v: 19, exp: () => 'dezanove' },
    {
      v: 20, exp(n, o, i) {
        let r: string;
        switch (Math.floor(n / 10)) {
          case 2: r = 'vinte'; break;
          case 3: r = 'trinta'; break;
          case 4: r = 'quarenta'; break;
          case 5: r = 'cinquenta'; break;
          case 6: r = 'sessenta'; break;
          case 7: r = 'setenta'; break;
          case 8: r = 'oitenta'; break;
          case 9: r = 'noventa'; break;
        }
        let t = n % 10;
        if (t)
          r += ' e ' + o.c(t, o, i - 1);
        return r;
      }
    },

    { v: 100, exp: (n, o, i) => n == 100 ? 'cem' : 'cento e ' + o.c(n - 100, o, i - 1) },
    {
      v: 200, exp(n, o, i) {
        let r: string;
        switch (Math.floor(n / 100)) {
          case 2: r = 'duzentos'; break;
          case 3: r = 'trezentos'; break;
          case 4: r = 'quatrocentos'; break;
          case 5: r = 'quinhentos'; break;
          case 6: r = 'seiscento'; break;
          case 7: r = 'setecentos'; break;
          case 8: r = 'oitocentos'; break;
          case 9: r = 'novecentos'; break;
        }
        let t = n % 100;
        if (t)
          r += ' e ' + o.c(t, o, i - 1);
        return r;
      }
    },
    {
      v: 1_000, exp: (n, o, i) => {
        let
          t1 = Math.floor(n / 1_000),
          r = t1 == 1 ? 'mil' : o.c(t1, o, i - 1) + ' mil',
          t2 = n % 1_000;
        if (t2)
          r += ', ' + o.c(t2, o, i - 1);
        return r;
      }
    },
    {
      v: 1_000_000, exp: (n, o, i) => {
        let
          t1 = Math.floor(n / 1_000_000),
          r = t1 == 1 ? 'um milhão' : o.c(t1, o, i - 1) + ' milhões',
          t2 = n % 1_000_000;
        if (t2)
          r += ', ' + o.c(t2, o, i - 1);
        return r;
      }
    },
    {
      v: 1_000_000_000_000, exp: (n, o, i) => {
        let
          t1 = Math.floor(n / 1_000_000_000_000),
          r = t1 == 1 ? 'um bilhão' : o.c(t1, o, i - 1) + ' bilhões',
          t2 = n % 1_000_000_000_000;
        if (t2)
          r += ', ' + o.c(t2, o, i - 1);
        return r;
      }
    },
    //{ v: 1_000_000, exp: (o) => o.n.slice(0, 3) == '00' ? 'mil e' : 'trinta' },
    //{ v: 1_000_000_000, exp: (o) => o.n.slice(0, 3) == '00' ? 'mil e' : 'trinta' },

    //{ key: 0, value: { m: 'zero' } },
    //{ key: 1, value: { m: 'um', f: 'uma' } },
    //{ key: 2, value: { m: 'dois', f: 'duas' } },
    //{ key: 3, value: { m: 'três' } },
    //{ key: 4, value: { m: 'quatro' } },
    //{ key: 5, value: { m: 'cinco' } },
    //{ key: 6, value: { m: 'seis' } },
    //{ key: 7, value: { m: 'sete' } },
    //{ key: 8, value: { m: 'oito' } },
    //{ key: 9, value: { m: 'nove' } },
    //{ key: 10, value: { m: 'dez' } },
    //{ key: 11, value: { m: 'onze' } },
    //{ key: 12, value: { m: 'doze' } },
    //{ key: 13, value: { m: 'treze' } },
    //{ key: 14, value: { m: 'quatorze' } },
    //{ key: 15, value: { m: 'quinze' } },
    //{ key: 16, value: { m: 'deseseis' } },
    //{ key: 17, value: { m: 'desete' } },
    //{ key: 18, value: { m: 'desoito' } },
    //{ key: 19, value: { m: 'desenove' } },

    //{ key: 20, value: { m: 'vinte' } },

    //{ key: 30, value: { m: 'trinta' } },

    //{ key: 40, value: { m: 'quarenta' } },

    //{ key: 50, value: { m: 'cinquenta' } },

    //{ key: 60, value: { m: 'sesenta' } },

    //{ key: 70, value: { m: 'setenta' } },
    //{ key: 70, value: { m: 'setenta' } },

    //{ key: 80, value: { m: 'oitenta' } },

    //{ key: 90, value: { m: 'noventa' } },

    //{ key: 100, value: { m: 'cem', c: 'cento' } },

    //{ key: 200, value: { m: 'duzentos' } },

    //{ key: 300, value: { m: 'tresentos' } },

    //{ key: 400, value: { m: 'quatrocentos' } },

    //{ key: 500, value: { m: 'quinhentos' } },

    //{ key: 600, value: { m: 'seiscento' } },

    //{ key: 700, value: { m: 'setecentos' } },

    //{ key: 800, value: { m: 'oitocentos' } },

    //{ key: 900, value: { m: 'novecentos' } },

    //{ key: 1_000, value: { m: 'mil' } },

    //{ key: 1000000, value: { m: 'milhão' } },
    ////{ key: _1000000p, value: { m: 'milhões' } },

    ////{ key: _1000000000, value: { m: 'bilhão' } },
    ////{ key: _1000000000p, value: { m: 'bilhões' } },

    ////{ key: _1000000000000, value: { m: 'trilhão' } },
    ////{ key: _1000000000000p, value: { m: 'trilhões' } },

    //{ key: 1_000_000_000_000_000, value: { m: 'quatrilhão' } }
  ]
});
export type AcceptFormatValue = Date | timeInput | scalarInput | number | string;

/**
 * 
 * @param value
 * @param exp format(t;format;if null)
 */
export type ValueType = 's' | 'd' | 'b' | 'n';

/**
 * format un number,string,date, time date-time,enumerator or boolean
 * @param value
 * @param exp
 * @param opts
 */
export default function format(value: AcceptFormatValue, exp: string, opts?: Dic): any;
export default function format(value: AcceptFormatValue, exp: string, tp?: ValueType): any;
export default function format(value: AcceptFormatValue, exp: string, opts?: ValueType | Dic) {
  if (typeof opts == "string") {
    exp = exp + ";" + opts;
    opts = <Dic>null;
  }
  if (value == null && opts && opts.def)
    return opts.def;

  if (exp == null)
    return <any>value;
  let split = exp.split(';', 3),
    type = split[0],
    //se o array so tiver um element então este é o format
    format = split.length > 1 ? split[1] : type;

  if (value == null && split.length == 3)
    value = split[2];

  //a:Any
  if (split.length == 1 || type == 'a') {
    switch (typeof value) {
      case 'number':
      case 'bigint':
        type = 'n';
        break;
      case 'string':
        if (isNaN(<any>value))
          type = 'n';
        else if (false)
          type = 'd';
        else type = 't';
        break;
      case 'object':
        type = 'd';
        break;
      case 'boolean':
        type = 'b';
        break;
      default:
        type = 't';
    }
  }
  switch (split[0]) {
    //date
    case 'd':
      return formatTime(time(value), format);
    //number
    case 'n':
      return scalar(<scalarInput>value).fmt(format, opts);
    default:
  }
}