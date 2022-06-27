import fmt from "./format";
interface Dic<T = any> { [key: string]: T; }

const textFormatRegex = /\{([\w-\d]+)\} /;

/** */
export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * check if a value is a valid email;
 * @param value
 */
export function isEmail(value: string) {
  return true;
}

/**
 * pesquisa dentro da segunda string a primeira;
 * @param pattern
 * @param text
 */
export function match(pattern: string, text) {
  if (!pattern) return true;

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
export function build(str: string) {

}
export type Input = string | Text;
export class Text {
  input: string;
  constructor(input: Input) {
    this.input =
      input instanceof Text ?
        input.input :
        input;
  }
  format(format: string) {
    return this.input;
  }
}

export interface PhraseParam {
  value(value: string): string;
}

class PhraseNumberParam implements PhraseParam {
  value(value: string) {
    return value;
  }

}


export type TextCase =
  //UPPER CASE
  'U' |
  //lower case
  'L' |
  //Sentence case
  'S' |
  //Capitalize Each Word
  'C';
export type TextStyle =
  //Bounds (primeira e ultima palavra, usada para nomes)
  'B' |
  //mesmo que 'B' so que a primeira é abreviada 
  'b' |
  //(Name case)primeira e ultima palavra com as do meio abreviada(A. B.)
  'N' |
  //todas abreviada excepto a ultima
  'n' |
  //Tel, format como tel baseado no locale
  'T';
export type TextSize =
  //(suspension points)reticencia no fim quando ultrapassa o max char
  'P' |
  //reticencia no meio quando ultrapassa o max char
  'p' |
  //(Hide) corta o fim quando ultrapassa
  'H';

//{any} para scape \{any}
//{property-name:type:format:default-value}
const replaceRegex = /\{\w+(?:;[dnte](?:;[\w:\s-+\\/]*(?:;[^}]+)?)?)?\}/g;

export function format(str: string, params: Dic) {
  if (str)
    return str.replace(replaceRegex, (exp) => {
      var i = (exp = exp.slice(1, exp.length - 1)).indexOf(';');
      return i == -1 ?
        params[exp] :
        fmt(params[exp.substr(0, i - 1)], exp.substr(i + 1));
    });
}
export function process(str: string, params: (text: string) => any) {
  var result = [],
    temp: RegExpExecArray,
    oldLast = 0;
  while ((temp = replaceRegex.exec(str)) !== null) {
    result.push(
      str.substring(oldLast, temp.index),
      params(temp[0].slice(1, temp[0].length))
    );
    oldLast = replaceRegex.lastIndex;
  }
  result.push(str.substring(oldLast));
  replaceRegex.lastIndex = 0;
  return result;
}
export interface TextFormatOptions {

}
/**
* recebe um pattern e gera uma string usando os parametros
* @param pattern string a substituier ex:(a soma é:{sum})
* @param params
*/
export function htmlTextFormat(pattern: string, params: Dic, options: TextFormatOptions = {}) {
  //pattern.split()k
  pattern.replace(textFormatRegex, (str) => {
    if (!(str in (<Dic>params)))
      throw `param '${str}' is not present in params`;
    return params[str];
  });
  //document.createTreeWalker
  //return pattern;
  throw "not implemented";
}

//export function textFormat(keys: string[] | string, params: Dictionary<string | number | boolean>) {
//   return pattern.replace(textFormatRegex, (str) => {
//      if (!(str in (<Dictionary>params)))
//         throw `param '${str}' is not present in params`
//      return <string>params[str];
//   });
//}