"use strict";
function text(input) {
    return new text.Text(input);
}
(function (text_1) {
    const textFormatRegex = /\{([\w-\d]+)\} /;
    text_1.emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    function isEmail(value) {
        return true;
    }
    text_1.isEmail = isEmail;
    function match(pattern, text) {
        if (!pattern)
            return true;
        for (let word of pattern.split(' ')) {
            if (text.indexOf(word) === -1)
                return false;
        }
        return true;
    }
    text_1.match = match;
    function insert(str, insert, index) {
        if (index == str.length)
            return str + insert;
        else if (index == 0)
            return insert + str;
        else
            return str.slice(0, index) + insert + str.slice(index);
    }
    text_1.insert = insert;
    function build(str) {
    }
    text_1.build = build;
    class Text {
        constructor(input) {
            this.input =
                input instanceof Text ?
                    input.input :
                    input;
        }
        format(format) {
            return this.input;
        }
    }
    text_1.Text = Text;
    class PhraseNumberParam {
        value(value) {
            return value;
        }
    }
    const replaceRegex = /\{\w+(?:;[dnte](?:;[\w:\s-+\\/]*(?:;[^}]+)?)?)?\}/g;
    function format(str, params) {
        if (str)
            return str.replace(replaceRegex, (exp) => {
                var i = (exp = exp.slice(1, exp.length - 1)).indexOf(';');
                return i == -1 ?
                    params[exp] :
                    fmt(params[exp.substr(0, i - 1)], exp.substr(i + 1));
            });
    }
    text_1.format = format;
    function process(str, params) {
        var result = [], temp, oldLast = 0;
        while ((temp = replaceRegex.exec(str)) !== null) {
            result.push(str.substring(oldLast, temp.index), params(temp.a.slice(1, temp.a.length)));
            oldLast = replaceRegex.lastIndex;
        }
        result.push(str.substring(oldLast));
        replaceRegex.lastIndex = 0;
        return result;
    }
    text_1.process = process;
    function htmlTextFormat(pattern, params, options = {}) {
        pattern.replace(textFormatRegex, (str) => {
            if (!(str in params))
                throw `param '${str}' is not present in params`;
            return params[str];
        });
        throw "not implemented";
    }
    text_1.htmlTextFormat = htmlTextFormat;
})(text || (text = {}));
const { fmt } = require("./index");
module.exports = text;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLFNBQVMsSUFBSSxDQUFDLEtBQWlCO0lBQzdCLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFDRCxXQUFPLE1BQUk7SUFFVCxNQUFNLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQztJQUc3QixpQkFBVSxHQUFHLHdKQUF3SixDQUFDO0lBTW5MLFNBQWdCLE9BQU8sQ0FBQyxLQUFhO1FBQ25DLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUZlLGNBQU8sVUFFdEIsQ0FBQTtJQU9ELFNBQWdCLEtBQUssQ0FBQyxPQUFlLEVBQUUsSUFBSTtRQUN6QyxJQUFJLENBQUMsT0FBTztZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRTFCLEtBQUssSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNuQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMzQixPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBRWQsQ0FBQztJQVRlLFlBQUssUUFTcEIsQ0FBQTtJQUNELFNBQWdCLE1BQU0sQ0FBQyxHQUFXLEVBQUUsTUFBYyxFQUFFLEtBQWE7UUFDL0QsSUFBSSxLQUFLLElBQUksR0FBRyxDQUFDLE1BQU07WUFDckIsT0FBTyxHQUFHLEdBQUcsTUFBTSxDQUFDO2FBQ2pCLElBQUksS0FBSyxJQUFJLENBQUM7WUFDakIsT0FBTyxNQUFNLEdBQUcsR0FBRyxDQUFDOztZQUNqQixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFOZSxhQUFN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