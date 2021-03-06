const
  defaultFormat = 'dd-MM-yyyy hh:mm', //'yyyy-MM-dd hh:mm:ss';
  formatRegex = /(LT|y{2,4}|M{1,4}|d{1,2}|H{1,2}|h{1,2}|m{1,2}|s{1,2})/g,
  quickformat = {
    //deprecate
    lt: 'dd-MM-yyyy hh:mm',
    //deprecate
    l: 'dd-MM-yyyy',
    f: 'dd-MM-yyyy hh:mm',
    d: 'dd-MM-yyyy',
    t: 'hh:mm'
  };




// export default function time(input: Date | string = new Date()) {
//   return typeof input == "string" ? fromT(input) : new Time(input);
// }
exports.Time = class {
  constructor(v) {
    this.v = v;
  }
  minute(value) {
    if (value == null)
      return this.v.getMinutes();
    this.v.setMinutes(value);
    return this;
  }
  second(value) {
    if (value == null)
      return this.v.getSeconds();
    this.v.setSeconds(value);
    return this;
  }
  hour(value) {
    if (value == null)
      return this.v.getHours();
    this.v.setHours(value);
    return this;
  }
  addHour(value) {
    this.v.setHours(this.v.getHours() + value);
    return this;
  }
  day(value) {
    if (value == null)
      return this.v.getDate();
    this.v.setDate(value);
    return this;
  }
  addDay(value) {
    this.v.setDate(this.v.getDate() + value);
    return this;
  }
  addYear(value) {
    this.v.setFullYear(this.v.getFullYear() + value);
    return this;
  }
  addMonth(value) {
    this.v.setMonth(this.v.getMonth() + value);
    return this;
  }
  weekStart() {
    return this.addDay(-this.v.getDay());
  }
  fromNow(format) {
    ///*2 anos*/'Y' |/*2*/'N' |/*2 anos e 3 meses*/'M' |/*2 anos; 3 meses*/'m'
  }
  clone() { return new Time(new Date(this.v.getTime())); }
  subtract() {
  }
  diff(input, period = 86400 /* d */) {
    let span = this.v.getTime() - input.v.getTime();
    return Math.floor(span / (period * 1000));
  }
  add(value) {
    this.v.setMilliseconds(this.v.getMilliseconds() + value);
    return this;
  }
  equal(other) {
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
   * retorna a diferen??a de tempo
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


exports.lastday = (t) => {
  return new Date(year(t), month(t), 0).getDate();
}
exports.year = (t, value) => {
  if (value == null)
    return t.getFullYear();
  t.setFullYear(value);
  return t;
}
exports.month = (t, value) => {
  if (value == null)
    return t.getMonth() + 1;
  t.setMonth(value - 1);
  return t;
}
function valid(t) { return t != null || isNaN(t); }
exports.toInput = (t, type) => {
  if (!valid(t.v))
    return null;
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
exports.formatTime = (t, pattern, def) => {
  let i = t instanceof Date ? t : t.v;
  if (!i)
    return '';
  if (pattern in quickformat)
    pattern = quickformat[pattern];
  if (valid(i))
    return (pattern || defaultFormat).replace(formatRegex, (sub) => {
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
  else
    def || '';
  return null;
}
exports.toDB = (t) => formatTime(t, 'yyyy-MM-dd HH:mm:ss');
exports.getTime = (date) => {
  return `${(date.getHours() + '').padStart(2, '0')}:${(date.getMinutes() + '').padStart(2, '0')}:${(date.getSeconds() + '').padStart(2, '0')}`;
}
exports.store = (input) => {
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
exports.check = (input) => {
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
exports.now = () => {
  return new Time(new Date());
}
exports.fullFormat = 'yyyy-MM-dd hh:mm:ss'; //'yyyy-MM-dd hh:mm:ss';

function inputValue(input) {
  return new Date(input instanceof Time ? input.v : input);
}
exports.Period = class {
  constructor(begin, end) {
  }
  format(format) {
    return "";
  }
}
