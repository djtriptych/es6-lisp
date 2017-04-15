import _ from 'lodash';

const [LPAREN, RPAREN] = '()';

export class ParseError extends Error {};
export class UnknownSymbol extends Error {};

export class Sym {

  static map = {};

  constructor(name) {
    if (Sym.map[name]) {
      return Sym.map[name];
    } else  {
      this.name = name;
      Sym.map[name] = this;
    }
  }

  toString() {
    return `Sym: ${this.name}`
  }

  valueOf = toString;
};

export class Environment {

  constructor(dict) {
    this.dict = dict;
    this.parent = null;
  }

  lookup(symbol) {
    const key = symbol.name;
    if (key in this.dict) {
      return this.dict[symbol.name];
    } else if (this.parent) {
      return this.parent.lookup(symbol);
    } else {
      throw new UnknownSymbol(symbol.name)
    }
  }

}

export const tokenize = (source) =>
  source
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .trim()
    .split(/\s+/)
    [Symbol.iterator]();

export const s_expression = function* (tokens) {
  let c = tokens.next().value;
  if (c === LPAREN) {
    yield [...s_expression(tokens)];
  } else if (c === RPAREN) {
    return;
  } else if (_.isUndefined(c)) {
    throw new ParseError('Unexpected EOF');
  } else {
    yield atom(c);
  }
  yield* s_expression(tokens);
};

export const atom = token => {
  // Parse numbers
  if (_.isFinite(_.toNumber(token))) {
    if (_.parseInt(token) == _.toNumber(token)) {
      return parseInt(token, 10);
    }
    return parseFloat(token);
  }
  
  return new String(token);
};

const parse = program => s_expression(tokenize(program)).next().value;
export default parse;
