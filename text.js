import fmt from "./format";
const textFormatRegex = /\{([\w-\d]+)\} /;
/** */
exports.emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/**
 * check if a value is a valid email;
 * @param value
 */
exports.isEmail = (value) => {
  return true;
}
/**
 * pesquisa dentro da segunda string a primeira;
 * @param pattern
 * @param text
 */
exports.match = (pattern, text) => {
  if (!pattern)
    return true;
  for (let word of pattern.split(' ')) {
    if (text.indexOf(word) === -1)
      return false;
  }
  return true;
}
/**
 * md
 * @param str
 */
exports.build = (str) => {
}
exports.Text = class {
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
class PhraseNumberParam {
  value(value) {
    return value;
  }
}
//{any} para scape \{any}
//{property-name:type:format:default-value}
const replaceRegex = /\{\w+(?:;[dnte](?:;[\w:\s-+\\/]*(?:;[^}]+)?)?)?\}/g;
exports.format = (str, params) => {
  if (str)
    return str.replace(replaceRegex, (exp) => {
      var i = (exp = exp.slice(1, exp.length - 1)).indexOf(';');
      return i == -1 ?
        params[exp] :
        fmt(params[exp.substr(0, i - 1)], exp.substr(i + 1));
    });
}
exports.process = (str, params) => {
  var result = [], temp, oldLast = 0;
  while ((temp = replaceRegex.exec(str)) !== null) {
    result.push(str.substring(oldLast, temp.index), params(temp[0].slice(1, temp[0].length)));
    oldLast = replaceRegex.lastIndex;
  }
  result.push(str.substring(oldLast));
  replaceRegex.lastIndex = 0;
  return result;
}
/**
* recebe um pattern e gera uma string usando os parametros
* @param pattern string a substituier ex:(a soma é:{sum})
* @param params
*/
exports.htmlTextFormat = (pattern, params, options = {}) => {
  //pattern.split()k
  pattern.replace(textFormatRegex, (str) => {
    if (!(str in params))
      throw `param '${str}' is not present in params`;
    return params[str];
  });
  //document.createTreeWalker
  //return pattern;
  throw "not implemented";
}
//exports.textFormat=(keys: string[] | string, params: Dictionary<string | number | boolean>) =>{
//   return pattern.replace(textFormatRegex, (str) => {
//      if (!(str in (<Dictionary>params)))
//         throw `param '${str}' is not present in params`
//      return <string>params[str];
//   });
//}
