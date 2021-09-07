"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLocale = exports.setLocale = exports.locales = exports.locale = exports.text = exports.scalar = exports.time = void 0;
require("inutil");
const time = require("./time");
exports.time = time;
const scalar = require("./scalar");
exports.scalar = scalar;
const text = require("./text");
exports.text = text;
const bool = require("./bool");
exports.locales = {};
function setLocale(value) {
    if (typeof value === 'string')
        exports.locale = exports.locales[value];
    else
        for (let key of value)
            if (key in exports.locales) {
                exports.locale = exports.locales[key];
                break;
            }
}
exports.setLocale = setLocale;
function addLocale(key, locale) {
    exports.locales[key] = locale;
}
exports.addLocale = addLocale;
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
                let r;
                switch (Math.floor(n / 10)) {
                    case 2:
                        r = 'vinte';
                        break;
                    case 3:
                        r = 'trinta';
                        break;
                    case 4:
                        r = 'quarenta';
                        break;
                    case 5:
                        r = 'cinquenta';
                        break;
                    case 6:
                        r = 'sessenta';
                        break;
                    case 7:
                        r = 'setenta';
                        break;
                    case 8:
                        r = 'oitenta';
                        break;
                    case 9:
                        r = 'noventa';
                        break;
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
                let r;
                switch (Math.floor(n / 100)) {
                    case 2:
                        r = 'duzentos';
                        break;
                    case 3:
                        r = 'trezentos';
                        break;
                    case 4:
                        r = 'quatrocentos';
                        break;
                    case 5:
                        r = 'quinhentos';
                        break;
                    case 6:
                        r = 'seiscento';
                        break;
                    case 7:
                        r = 'setecentos';
                        break;
                    case 8:
                        r = 'oitocentos';
                        break;
                    case 9:
                        r = 'novecentos';
                        break;
                }
                let t = n % 100;
                if (t)
                    r += ' e ' + o.c(t, o, i - 1);
                return r;
            }
        },
        {
            v: 1000, exp: (n, o, i) => {
                let t1 = Math.floor(n / 1000), r = t1 == 1 ? 'mil' : o.c(t1, o, i - 1) + ' mil', t2 = n % 1000;
                if (t2)
                    r += ', ' + o.c(t2, o, i - 1);
                return r;
            }
        },
        {
            v: 1000000, exp: (n, o, i) => {
                let t1 = Math.floor(n / 1000000), r = t1 == 1 ? 'um milhão' : o.c(t1, o, i - 1) + ' milhões', t2 = n % 1000000;
                if (t2)
                    r += ', ' + o.c(t2, o, i - 1);
                return r;
            }
        },
        {
            v: 1000000000000, exp: (n, o, i) => {
                let t1 = Math.floor(n / 1000000000000), r = t1 == 1 ? 'um bilhão' : o.c(t1, o, i - 1) + ' bilhões', t2 = n % 1000000000000;
                if (t2)
                    r += ', ' + o.c(t2, o, i - 1);
                return r;
            }
        },
    ]
});
function fmt(value, exp, opts) {
    if (value == null && opts && opts.def)
        return opts.def;
    if (exp == null)
        return value;
    let split = exp.split(';', 3), type = split.a, format = split.length > 1 ? split[1] : type;
    if (value == null && split.length == 3)
        value = split[2];
    if (split.length == 1 || type == 'a') {
        switch (typeof value) {
            case 'number':
            case 'bigint':
                type = 'n';
                break;
            case 'string':
                if (isNaN(value))
                    type = 'n';
                else if (false)
                    type = 'd';
                else
                    type = 't';
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
    switch (split.a) {
        case 'd':
            return time.create(value).fmt(format);
        case 'n':
            return scalar(value).format(format, opts);
        case 't':
        case 's':
            return text(value).format(format);
        case 'e':
            return null;
        case 'b':
            return bool.get(value, format);
        default:
    }
}
exports.default = fmt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrQkFBZ0I7QUFFaEIsK0JBQStCO0FBS3RCLG9CQUFJO0FBSmIsbUNBQW1DO0FBSXBCLHdCQUFNO0FBSHJCLCtCQUErQjtBQUdSLG9CQUFJO0FBRjNCLCtCQUErQjtBQVFwQixRQUFBLE9BQU8sR0FBZ0IsRUFBRSxDQUFDO0FBRXJDLFNBQWdCLFNBQVMsQ0FBQyxLQUFrQjtJQUMxQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVE7UUFDM0IsY0FBTSxHQUFHLGVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7UUFDckIsS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLO1lBQ3hCLElBQUksR0FBRyxJQUFJLGVBQU8sRUFBRTtnQkFDbEIsY0FBTSxHQUFHLGVBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdEIsTUFBTTthQUNQO0FBRUwsQ0FBQztBQVRELDhCQVNDO0FBQ0QsU0FBZ0IsU0FBUyxDQUFDLEdBQVcsRUFBRSxNQUFjO0lBWW5ELGVBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDeEIsQ0FBQztBQWJELDhCQWFDO0FBQ0QsU0FBUyxDQUFDLElBQUksRUFBRTtJQUNkLE1BQU0sRUFBRTtRQUNOLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFO1FBRTNCLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7UUFDbEQsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNyRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRTtRQUMzQixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUM3QixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sRUFBRTtRQUM1QixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRTtRQUMzQixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRTtRQUMzQixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRTtRQUMzQixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRTtRQUUzQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRTtRQUMzQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRTtRQUM1QixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRTtRQUM1QixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sRUFBRTtRQUM3QixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRTtRQUNoQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdB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