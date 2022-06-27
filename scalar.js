function splicestr(str, start, deleteCount, insert) {
  var left = str.slice(0, start), right = str.slice(start + deleteCount);
  return left + insert + right;
}
const
  value = (input) => {
    switch (typeof input) {
      case "number":
        return input;
      case "string":
        return parseFloat(input);
      default:
        if (!(input instanceof Scalar))
          return NaN;
        return input.value;
    }
  },
  checknum = (value, exp) => {
    let t = Math.pow(10, exp);
    return Math.round(value * t) / t;
  },
  $ = {};
exports.value = value;
exports.checknum = checknum;
exports.$ = $;
exports.default = (input, format) => new Scalar(input, format);
exports.reverseFormat = (input, format) => {
  return 0;
}
exports.inFull = [];
exports.len = (value) => {
  return (value + '').length;
}
exports.check = (input) => {
  if (typeof input === 'string') {
  }
  //se for Date or input return;
  if ((input instanceof Date && (input = new Scalar(input))) || input instanceof Scalar)
    return input;
  return null;
}
function invalidInputError() {
}
const romannums = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
const chars = "abcdefghijklmnopqrstuvwxyz";
//function toRomanize
//function toLetter
let defaultOptions = {};
let defaultFormat = '0,0.0';
const formatRegex = /\+|0+|,0|.0+|$|u|'[^']+'/;
const periods = [
  { k: 31556736 /* y */, s: 'ano', p: 'anos' },
  { k: 2629728 /* M */, s: 'mês', p: 'mêses' },
  { k: 604800 /* w */, s: 'semana', p: 'semanas' },
  { k: 86400 /* d */, s: 'dia', p: 'dias' },
  { k: 3600 /* h */, s: 'hora', p: 'horas' },
  { k: 60 /* m */, s: 'minuto', p: 'minutos' },
  { k: 1 /* s */, s: 'segundo', p: 'segundos' },
];
const transforms = new Map([
  ["i" /* romanize */, function (value) {
    let roman = '', i;
    for (i in romannums) {
      while (value >= romannums[i]) {
        roman += i;
        value -= romannums[i];
      }
    }
    return roman;
  }],
  ["a" /* letter */, function (value) {
    let dividend = value;
    let result = "";
    let modulo;
    while (dividend > 0) {
      modulo = (dividend - 1) % 26;
      result = chars[modulo] + result;
      dividend = Math.floor((dividend - modulo) / 26);
    }
    return result;
  }],
  ["t" /* timer */, function (value) {
    let r = [], count = 2, space = 2;
    for (let i = 0; i < periods.length; i++) {
      let period = periods[i];
      if (value >= period.k) {
        let temp = Math.floor(value / period.k);
        r.push(temp + ' ' + (temp === 1 ? period.s : period.p));
        value -= temp * period.k;
        if (!--count)
          break;
      }
      else if (count < 2 && !--space)
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
  ["f" /* inFull */, function (value, opts) {
    let vals = inFull, int = Math.floor(value), dec = Math.round(value % 1 * 100);
    if (int == 0)
      return vals[0].exp();
    if (!opts)
      opts = {};
    if (!opts.g)
      opts.g = 'm';
    opts.c = (v, opts, i = vals.length - 1) => {
      for (; i > 0; i--) {
        let t = vals[i];
        if (t.v <= v)
          return t.exp(v, opts, i);
      }
    };
    let t = opts.c(int, opts);
    if (opts.p) {
      t += ' ' + (int == 1 && opts.s || opts.p);
      if (dec)
        if (opts.dp) {
          t += ` e ${opts.c(dec, opts)} ${(dec == 1 && opts.ds || opts.dp)}`;
        }
        else {
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
const singleFormats = {
  ["N" /* N */]: '0,0.00',
  ["D" /* D */]: '0,0',
  ["%" /* P */]: '0,0.0 %',
  ["E" /* E */]: '0,0E',
  ["$" /* C */]: '0,0.00 $'
};
exports.defaultLocale = {
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
class Scalar {
  constructor(input, format) {
    this.value = value(input);
  }
  add(input) {
    return new Scalar(this.value + value(input));
  }
  sub(input) {
    return new Scalar(this.value - value(input));
  }
  time(input) {
    return new Scalar(this.value * value(input));
  }
  div(input) {
    return new Scalar(this.value / value(input));
  }
  fmt(format, opts = defaultOptions) {
    let value = checknum(this.value, 4);
    if (isNaN(value))
      return '';
    {
      let t = transforms.get(format);
      if (t)
        return t(value, opts);
    }
    if (format in singleFormats)
      format = singleFormats[format];
    else if (!format)
      format = defaultFormat;
    let t0;
    //escape
    while ((t0 = format.indexOf('\\', t0)) != -1)
      format = splicestr(format, t0, 2, '"' + format[t0 + 1] + '"');
    //unit
    if ((t0 = format.indexOf('*')) != -1) {
      format = splicestr(format, t0, 1, '"' + opts.unit + '"');
    }
    //currency
    if ((t0 = format.indexOf('$')) != -1) {
      let curr = opts.currency || $.currency, temp = $.currencies?.find(v => v.code == curr);
      temp?.value && (value = value * (temp.value / (opts.refCur || 1)));

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
    let integer = value + '', pointIndex = integer.indexOf('.'), float = '',
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
        case '.':
          {
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
            else
              float = float.padEnd(min, '0');
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
  transform(format, opts = defaultOptions) {
    let t = transforms.get(format);
    if (t)
      return t(this.value, opts);
    else
      return "invalid";
  }
  get valid() {
    return !Number.isNaN(this.value);
  }
}
exports.Scalar = Scalar;
