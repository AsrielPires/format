import { PeriodType } from "./time";
import { locale } from "./index";

type num = number;
type str = string;
interface Dic<T = any> { [key: string]: T; }

function splicestr(str: str, start: num, deleteCount: num, insert: str) {
  var
    left = str.slice(0, start),
    right = str.slice(start + deleteCount);
  return left + insert + right;
}


/**
 * 
 * @param input
 */
function scalar(input: scalar.Input): scalar.Scalar;
/**
 * 
 * @param input
 * @param format 
 */
function scalar(input: scalar.Input, format: str): scalar.Scalar;
function scalar(input: scalar.Input, format?: str): scalar.Scalar {
  return new scalar.Scalar(input, format);
}
module scalar {
  export interface Currency {
    id?: num;
    code: str;
    symbol?: str;
    name?: str;
    value: num;
  }
  export function reverseFormat(input: str, format: str) {
    return 0;
  }
  export function len(value: num) {
    return (value + '').length;
  }
  const checkFormats = [
    ///^(<d>\d{2})-(<M>\d{2})-(<y>\d{4})$/,
    ///^(?<h>\d{2}):(?<m>\d{2})(?::(?<s>\d{2}))$/,
  ];
  export function check(input: Input) {

    if (typeof input === 'string') {

    }

    //se for Date or input return;
    if ((input instanceof Date && (input = new Scalar(input))) || input instanceof Scalar)
      return input;

    return null;
  }
  export type Input = str | num | Scalar;

  function invalidInputError() {

  }
  export function value(input: Input) {
    switch (typeof input) {
      case "number":
        return <num>input;

      case "string":
        return parseFloat(<str>input);

      default:
        if (!(input instanceof Scalar))
          return NaN;
        return (<Scalar>input).value;
    }
  }

  const romannums = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  const chars = "abcdefghijklmnopqrstuvwxyz";

  //function toRomanize
  //function toLetter
  let defaultOptions = {};
  let defaultFormat = '0,0.0';
  const formatRegex = /\+|0+|,0|.0+|$|u|'[^']+'/;
  //const checkFormat = /$?\s*\+?0*(,0)?(.0+)\s*$|u?/;
  export const enum Transform {
    romanize = 'i',
    letter = 'a',
    timer = 't',
    inFull = 'f',
  }
  const periods = [
    { k: PeriodType.y, s: 'ano', p: 'anos' },
    { k: PeriodType.M, s: 'mês', p: 'mêses' },
    { k: PeriodType.w, s: 'semana', p: 'semanas' },
    { k: PeriodType.d, s: 'dia', p: 'dias' },
    { k: PeriodType.h, s: 'hora', p: 'horas' },
    { k: PeriodType.m, s: 'minuto', p: 'minutos' },
    { k: PeriodType.s, s: 'segundo', p: 'segundos' },
  ];
  const transforms = new Map<Transform, (value: num, opts?: Dic) => str>([
    [Transform.romanize, function (value: num) {
      let roman = '', i;
      for (i in romannums) {
        while (value >= romannums[i]) {
          roman += i;
          value -= romannums[i];
        }
      }
      return roman;
    }],
    [Transform.letter, function (value: num) {
      let dividend = value;
      let result = "";
      let modulo: num;
      while (dividend > 0) {
        modulo = (dividend - 1) % 26;
        result = chars[modulo] + result;
        dividend = Math.floor((dividend - modulo) / 26);
      }
      return result;
    }],
    [Transform.timer, function (value: num) {
      let r = [], count = 2, space = 2;

      for (let i = 0; i < periods.length; i++) {
        let period = periods[i];
        if (value >= period.k) {
          let temp = Math.floor(value / period.k);
          r.push(temp + ' ' + (temp === 1 ? period.s : period.p));
          value -= temp * period.k;
          if (!--count)
            break;

        } else if (count < 2 && !--space)
          break;
      }
      //if (value >= time.PeriodType.y) {
      //  temp = Math.floor(value / time.PeriodType.y);
      //  r.push(temp + ' Ano(s)');
      //  value -= temp * time.PeriodType.y;
      //}
      //if (value >= time.PeriodType.M) {
      //  temp = Math.floor(value / time.PeriodType.M);
      //  r.push(temp + ' Mês(es)');
      //  value -= temp * time.PeriodType.M;
      //}
      //if (value >= time.PeriodType.d) {
      //  temp = Math.floor(value / time.PeriodType.d);
      //  r.push(temp + ' Dia(s)');
      //  value -= temp * time.PeriodType.d;
      //}
      //if (value >= time.PeriodType.h) {
      //  temp = Math.floor(value / time.PeriodType.h);
      //  r.push(temp + ' Hora(s)');
      //  value -= temp * time.PeriodType.h;
      //}
      //if (value >= time.PeriodType.m) {
      //  temp = Math.floor(value / time.PeriodType.m);
      //  r.push(temp + ' Minuto(s)');
      //  value -= temp * time.PeriodType.m;
      //}
      //if (value >= time.PeriodType.s) {
      //  temp = Math.floor(value / time.PeriodType.s);
      //  r.push(temp + ' Segundo(s)');
      //  value -= temp * time.PeriodType.s;
      //}

      return r.join(' e ');
    }],
    [Transform.inFull, function (value: num, opts: Partial<InFullOptions>) {

      let
        vals = locale.inFull,
        int = Math.floor(value),
        dec = Math.round(value % 1 * 100);

      if (int == 0)
        return vals[0].exp();
      if (!opts)
        opts = {};
      if (!opts.g)
        opts.g = 'm';
      opts.c = (v, opts: InFullOptions, i = vals.length - 1) => {
        for (; i > 0; i--) {
          let t = vals[i];
          if (t.v <= v)
            return t.exp(v, opts, i);
        }
      }
      let t = opts.c(int, <InFullOptions>opts);
      if (opts.p) {
        t += ' ' + (int == 1 && opts.s || opts.p);
        if (dec)
          if (opts.dp) {
            t += ` e ${opts.c(dec, <InFullOptions>opts)} ${(dec == 1 && opts.ds || opts.dp)}`;

          } else {
            throw "not implemented";
          }
      }

      return t.toUpperCase();
      //let r = '';
      //{
      //  let t0 = vals[i];
      //  if (t0.v <= value) {
      //    let parts = [t0], t1 = Math.floor(value / t0.v);
      //    for (let j = i - 1; j > 0 && t1 != 1; j--) {
      //      t0 = vals[j];
      //      if (t0.v <= t1) {
      //        t1 = Math.floor(value / t0.v);

      //      }
      //    }
      //  }
      //}
      //return r;
    }]
  ]);
  export const enum SingleFormat {
    N = 'N',
    /** */
    D = 'D',
    /**Percentage */
    P = '%',
    /**Notação cientifica */
    E = 'E',

    /**Currency */
    C = '$'
  }
  const singleFormats = {
    [SingleFormat.N]: '0,0.00',
    [SingleFormat.D]: '0,0',
    [SingleFormat.P]: '0,0.0 %',
    [SingleFormat.E]: '0,0E',
    [SingleFormat.C]: '0,0.00 $'
  };
  export interface Locale {
    sub: { [index: num]: any; };
  }
  export const defaultLocale: Locale = {
    sub: {
      '-3': 'm',
      '-2': 'C',
      '-1': 'd',
      1: 'D',
      2: 'C',
      3: 'K',
      4: 'M'
    }
  };
  export function checknum(value: num, exp: num) {
    let t = Math.pow(10, exp);
    return Math.round(value * t) / t;
  }
  export class Scalar {
    /** */
    value: num;

    constructor(input: Input, format?: str) {
      this.value = value(input);
    }

    add(input: Input): Scalar {
      return new Scalar(this.value + value(input));
    }
    sub(input: Input): Scalar {
      return new Scalar(this.value - value(input));
    }
    time(input: Input): Scalar {
      return new Scalar(this.value * value(input));
    }
    div(input: Input): Scalar {
      return new Scalar(this.value / value(input));
    }
    format(format?: str | Transform | SingleFormat, opts: Dic = defaultOptions): str {
      let value = checknum(this.value, 4);
      if (isNaN(value))
        return '';
      {
        let t = transforms.get(<Transform>format);
        if (t)
          return t(value, opts);
      }
      if (format in singleFormats)
        format = singleFormats[format];
      else if (!format)
        format = defaultFormat;

      let t0: num;

      //escape
      while ((t0 = format.indexOf('\\', t0)) != -1)
        format = splicestr(format, t0, 2, '"' + format[t0 + 1] + '"');

      //unit
      if ((t0 = format.indexOf('*')) != -1) {
        format = splicestr(format, t0, 1, '"' + opts.unit + '"');
      }

      //currency
      if ((t0 = format.indexOf('$')) != -1) {
        let
          curr = opts.currency || currency(),
          sel = options.currencies?.find(v => v.code == curr);

        //value = value * (sel.value / (opts.refCur || 1));
        format = splicestr(format, t0, 1, opts.currencySymbol === false ? '' : '" ' + curr + '"');
      }
      //percent
      else if ((t0 = format.indexOf('%')) != -1) {
        value = value * 100;

        format = splicestr(format, t0, 1, '"%"');
      }

      //permilhagem
      else if ((t0 = format.indexOf('‰')) != -1) {
        value = value * 1000;
        format.replace('‰', '"‰"');
      }
      //arredondar
      else if ((t0 = format.indexOf('=')) != -1) {
        throw "not implemented";
        //value = value * 100;
        //const temp: Array<Pair2<num>> = [
        //  { key: 'G', val: 1_000_000_000 },
        //  { key: 'm', val: 1_000_000 },
        //  { key: 'k', val: 1_000 },
        //];
        //format.replace('=', '"K"');
      }

      let
        integer = value + '',
        pointIndex = integer.indexOf('.'),
        float = '',
        //floatValue: str,
        result = '';

      if (pointIndex != -1) {
        float = integer.slice(pointIndex + 1);
        integer = integer.slice(0, pointIndex);
      }

      for (let i = 0, l = format.length; i < l; i++) {
        switch (format[i]) {

          case '"':
            while (format[++i] != '"') {
              result += format[i];
            }
            break;
          case "'":
            while (format[++i] != "'") {
              result += format[i];
            }
            break;
          case '0':
            t0 = 0;
            while (format[i + t0] == "0")
              ++t0;

            integer = integer.padStart(t0, '0');

            result = splicestr(result, i - t0 + 1, t0, integer);
            i += t0 - 1;

            break;
          case ',':
            t0 = 0;
            i++;

            let r = '', il = integer.length;
            for (let j = il; j > 0; j -= 3) {
              r = ' ' + integer.slice(Math.max(j - 3, 0), j) + r;
            }
            result = splicestr(result, result.length - il, il, r.slice(1));

            break;
          case '.': {
            let min = 0;
            while (format[i + 1] == '0') {
              i++;
              min++;
            }
            let max = min;
            while (format[i + 1] == '#') {
              i++;
              max++;
            }
            if (float.length >= max)
              float = float.substr(0, max);
            else float = float.padEnd(min, '0');

            if (float.length)
              result += ',' + float;
          }
            break;
          case 'E':
            throw "not implemented";
          case '$':
            result += 'AKz';
            break;
          default: result += format[i];
        }
      }

      return result;

    }
    transform(format: Transform, opts: Dic = defaultOptions) {
      let t = transforms.get(format);
      if (t)
        return t(this.value, opts);
      else return "invalid";
    }
    get valid() {
      return !Number.isNaN(this.value);
    }
  }
  export interface InFullOptions {
    /**gender */
    g: 'f' | 'm',
    /**next */
    n?: str
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
    v: num,
    exp(value?: num, opts?: InFullOptions, i?: num): str;
  }

  interface Settings {
    null?: str;
    zero?: str;
    currencies?: Currency[];
    currency?: str;
  }
  let options: Settings = {};
  export const currency = () => options.currency;
  export const currencies = () => options.currencies;
  export function settings(value: Settings) {
    options = Object.assign({}, options, value);
  }
}

export = scalar;