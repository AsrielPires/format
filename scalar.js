"use strict";
const time_1 = require("./time");
const index_1 = require("./index");
function spliceString(str, start, deleteCount, insert) {
    var left = str.slice(0, start), right = str.slice(start + deleteCount);
    return left + insert + right;
}
function scalar(input, format) {
    return new scalar.Scalar(input, format);
}
(function (scalar) {
    function reverseFormat(input, format) {
        return 0;
    }
    scalar.reverseFormat = reverseFormat;
    function len(value) {
        return (value + '').length;
    }
    scalar.len = len;
    const checkFormats = [];
    function check(input) {
        if (typeof input === 'string') {
        }
        if ((input instanceof Date && (input = new Scalar(input))) || input instanceof Scalar)
            return input;
        return null;
    }
    scalar.check = check;
    function invalidInputError() {
    }
    function value(input) {
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
    }
    scalar.value = value;
    const romanNumbers = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let defaultOptions = {};
    let defaultFormat = '0,0.0';
    const formatRegex = /\+|0+|,0|.0+|$|u|'[^']+'/;
    const periods = [
        { k: time_1.PeriodType.y, s: 'ano', p: 'anos' },
        { k: time_1.PeriodType.M, s: 'mês', p: 'mêses' },
        { k: time_1.PeriodType.w, s: 'semana', p: 'semanas' },
        { k: time_1.PeriodType.d, s: 'dia', p: 'dias' },
        { k: time_1.PeriodType.h, s: 'hora', p: 'horas' },
        { k: time_1.PeriodType.m, s: 'minuto', p: 'minutos' },
        { k: time_1.PeriodType.s, s: 'segundo', p: 'segundos' },
    ];
    const transforms = new Map([
        ["i", function (value) {
                let roman = '', i;
                for (i in romanNumbers) {
                    while (value >= romanNumbers[i]) {
                        roman += i;
                        value -= romanNumbers[i];
                    }
                }
                return roman;
            }],
        ["a", function (value) {
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
        ["t", function (value) {
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
                return r.join(' e ');
            }],
        ["f", function (value, opts) {
                let vals = index_1.locale.inFull, int = Math.floor(value), dec = Math.round(value % 1 * 100);
                if (int == 0)
                    return vals.a.exp();
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
            }]
    ]);
    const singleFormats = {
        ["N"]: '0,0.00',
        ["D"]: '0,0',
        ["%"]: '0,0.0 %',
        ["E"]: '0,0E',
        ["$"]: '0,0.00 $'
    };
    scalar.defaultLocale = {
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
    function checkNumber(value, exp) {
        let t = Math.pow(10, exp);
        return Math.round(value * t) / t;
    }
    scalar.checkNumber = checkNumber;
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
        format(format, opts = defaultOptions) {
            var _a;
            let value = checkNumber(this.value, 4);
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
            while ((t0 = format.indexOf('\\', t0)) != -1)
                format = spliceString(format, t0, 2, '"' + format[t0 + 1] + '"');
            if ((t0 = format.indexOf('*')) != -1) {
                format = spliceString(format, t0, 1, '"' + opts.unit + '"');
            }
            if ((t0 = format.indexOf('$')) != -1) {
                let curr = opts.currency || scalar.currency(), sel = (_a = options.currencies) === null || _a === void 0 ? void 0 : _a.byKey(curr, 'code');
                format = spliceString(format, t0, 1, opts.currencySymbol === false ? '' : '" ' + curr + '"');
            }
            else if ((t0 = format.indexOf('%')) != -1) {
                value = value * 100;
                format = spliceString(format, t0, 1, '"%"');
            }
            else if ((t0 = format.indexOf('‰')) != -1) {
                value = value * 1000;
                format.replace('‰', '"‰"');
            }
            else if ((t0 = format.indexOf('=')) != -1) {
                throw "not implemented";
            }
            let integer = value + '', pointIndex = integer.indexOf('.'), float = '', result = '';
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
                        result = spliceString(result, i - t0 + 1, t0, integer);
                        i += t0 - 1;
                        break;
                    case ',':
                        t0 = 0;
                        i++;
                        let r = '', il = integer.length;
                        for (let j = il; j > 0; j -= 3) {
                            r = ' ' + integer.slice(Math.max(j - 3, 0), j) + r;
                        }
                        result = spliceString(result, result.length - il, il, r.slice(1));
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
    scalar.Scalar = Scalar;
    let options = {};
    scalar.currency = () => options.currency;
    scalar.currencies = () => options.currencies;
    function settings(value) {
        options = Object.assign({}, options, value);
    }
    scalar.settings = settings;
})(scalar || (scalar = {}));
module.exports = scalar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NhbGFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpQ0FBb0M7QUFDcEMsbUNBQWlDO0FBQ2pDLFNBQVMsWUFBWSxDQUFDLEdBQVcsRUFBRSxLQUFhLEVBQUUsV0FBbUIsRUFBRSxNQUFjO0lBQ25GLElBQ0UsSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUMxQixLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUM7SUFDekMsT0FBTyxJQUFJLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUMvQixDQUFDO0FBY0QsU0FBUyxNQUFNLENBQUMsS0FBbUIsRUFBRSxNQUFlO0lBQ2xELE9BQU8sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBQ0QsV0FBTyxNQUFNO0lBUVgsU0FBZ0IsYUFBYSxDQUFDLEtBQWEsRUFBRSxNQUFjO1FBQ3pELE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUZlLG9CQUFhLGdCQUU1QixDQUFBO0lBQ0QsU0FBZ0IsR0FBRyxDQUFDLEtBQWE7UUFDL0IsT0FBTyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDN0IsQ0FBQztJQUZlLFVBQUcsTUFFbEIsQ0FBQTtJQUNELE1BQU0sWUFBWSxHQUFHLEVBR3BCLENBQUM7SUFDRixTQUFnQixLQUFLLENBQUMsS0FBWTtRQUVoQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtTQUU5QjtRQUdELElBQUksQ0FBQyxLQUFLLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLFlBQVksTUFBTTtZQUNuRixPQUFPLEtBQUssQ0FBQztR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