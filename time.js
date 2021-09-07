"use strict";
function time(input = new Date()) {
    return new time.Time(input);
}
(function (time) {
    class Time {
        constructor(v) {
            this.v = v;
        }
        get valid() { return this.v != null || isNaN(this.v); }
        fmt(pattern, def) {
            let i = this.v;
            if (!i)
                return '';
            if (pattern in time.quickformat)
                pattern = time.quickformat[pattern];
            if (this.valid)
                return (pattern || time.defaultFormat).replace(time.formatRegex, (sub) => {
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
        toDB() {
            return this.fmt('yyyy-MM-dd HH:mm:ss');
        }
        lastday() {
            return new Date(this.year(), this.month(), 0).getDate();
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
        year(value) {
            if (value == null)
                return this.v.getFullYear();
            this.v.setFullYear(value);
            return this;
        }
        addYear(value) {
            this.v.setFullYear(this.v.getFullYear() + value);
            return this;
        }
        month(value) {
            if (value == null)
                return this.v.getMonth() + 1;
            this.v.setMonth(value - 1);
            return this;
        }
        addMonth(value) {
            this.v.setMonth(this.v.getMonth() + value);
            return this;
        }
        weekStart() {
            return this.addDay(-this.v.getDay());
        }
        toInput(type) {
            if (!this.valid)
                return null;
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
        fromNow(format) {
        }
        clone() { return new Time(new Date(this.v.getTime())); }
        subtract() {
        }
        diff(input, period = time.PeriodType.d) {
            let span = this.v.getTime() - input.v.getTime();
            return Math.floor(span / (period * 1000));
        }
        add(value) {
            this.v.setMilliseconds(this.v.getMilliseconds() + value);
            return this;
        }
        equal(other) {
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
    time.Time = Time;
    function getTime(date) {
        return `${(date.getHours() + '').padStart(2, '0')}:${(date.getMinutes() + '').padStart(2, '0')}:${(date.getSeconds() + '').padStart(2, '0')}`;
    }
    time.getTime = getTime;
    function store(input) {
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
    time.store = store;
    const checkFormats = [];
    function check(input) {
        if ((input instanceof Date && (input = new Time(input))) ||
            input instanceof Time ||
            (input && typeof input == 'object' && (input = new Time(input))))
            return input;
        return null;
    }
    time.check = check;
    function now() {
        return new Time(new Date());
    }
    time.now = now;
    function fromT(input) {
        if (!input)
            return new Time(null);
        let data = new Date(input);
        if (isNaN(data) && time.timeRegex.test(input)) {
            data = new Date('0000-01-01 ' + input);
        }
        return new Time(data);
    }
    time.fromT = fromT;
    function create(input) {
        if (input == null || input instanceof Date)
            return new Time(input);
        if (input instanceof Time)
            return input;
        else if (typeof input == 'string')
            return fromT(input);
        else if (typeof input == 'number')
            return new Time(new Date(input));
    }
    time.create = create;
    time.fullFormat = 'yyyy-MM-dd hh:mm:ss';
    time.defaultFormat = 'dd-MM-yyyy hh:mm';
    time.formatRegex = /(LT|y{2,4}|M{1,4}|d{1,2}|H{1,2}|h{1,2}|m{1,2}|s{1,2})/g;
    time.timeRegex = /\d{2}:\d{2}:\d{2}/;
    time.quickformat = {
        lt: 'dd-MM-yyyy hh:mm',
        l: 'dd-MM-yyyy',
        f: 'dd-MM-yyyy hh:mm',
        d: 'dd-MM-yyyy',
        t: 'hh:mm'
    };
    function inputValue(input) {
        return new Date(input instanceof Time ? input.v : input);
    }
    let PeriodType;
    (function (PeriodType) {
        PeriodType[PeriodType["z"] = 0.1] = "z";
        PeriodType[PeriodType["s"] = 1] = "s";
        PeriodType[PeriodType["m"] = 60] = "m";
        PeriodType[PeriodType["h"] = 3600] = "h";
        PeriodType[PeriodType["d"] = 86400] = "d";
        PeriodType[PeriodType["w"] = 604800] = "w";
        PeriodType[PeriodType["y"] = 31556736] = "y";
        PeriodType[PeriodType["f"] = 1314864] = "f";
        PeriodType[PeriodType["M"] = 2629728] = "M";
        PeriodType[PeriodType["M2"] = 5259456] = "M2";
        PeriodType[PeriodType["M3"] = 7889184] = "M3";
        PeriodType[PeriodType["M4"] = 10518912] = "M4";
        PeriodType[PeriodType["M6"] = 15778368] = "M6";
    })(PeriodType = time.PeriodType || (time.PeriodType = {}));
    class Period {
        constructor(begin, end) {
        }
        format(format) {
            return "";
        }
    }
    time.Period = Period;
})(time || (time = {}));
module.exports = time;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRpbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLFNBQVMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRTtJQUM5QixPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBQ0QsV0FBTyxJQUFJO0lBRVQsTUFBYSxJQUFJO1FBRWYsWUFBbUIsQ0FBTztZQUFQLE1BQUMsR0FBRCxDQUFDLENBQU07UUFBSSxDQUFDO1FBRS9CLElBQUksS0FBSyxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxDQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFNNUQsR0FBRyxDQUFDLE9BQWdCLEVBQUUsR0FBWTtZQUNoQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLENBQUM7Z0JBQUUsT0FBTyxFQUFFLENBQUM7WUFDbEIsSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLFdBQVc7Z0JBQzdCLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RDLElBQUksSUFBSSxDQUFDLEtBQUs7Z0JBQ1osT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQU8sRUFBRTtvQkFDNUUsUUFBUSxHQUFHLEVBQUU7d0JBQ1gsS0FBSyxNQUFNOzRCQUNULE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUV6QixLQUFLLElBQUk7NEJBQ1AsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUNoRCxL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