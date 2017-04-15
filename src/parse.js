import _ from 'lodash';
import Sym from './sym';

const [LPAREN, RPAREN] = '()';

export class ParseError extends Error {};

const tokenizer = () => {
  const types = [
    String.raw`,@`,                  // spread
    String.raw`[(\`,')]`,            // list & quote constructors
    String.raw`;.*`,                 // comment
    String.raw`"(?:[\\].|[^"])*"`,   // quoted string
    String.raw`[^\s('"\`,;)]*`,       // identifier
  ].join('|')
  const splitter = `\\s*(${types})(.*)`;
  return new RegExp(splitter);
}

export const tokenize_line = function* (source) {
  const splitter = tokenizer();
  let _, token;
  while (source.length) {
    let s = splitter;
    [_, token, source] = source.match(s);
    if (token.length && !(token[0] === ';')) {
      yield token;
    }
  }
};

export const tokenize = function* (source) {
  const lines = source.split(/[\r\n]+/)
  for (let i = 0; i < lines.length; i++) {
    yield* tokenize_line(lines[i]);
  }
}

export const s_expression = function* (tokens) {
  let c = tokens.next().value;
  if (c === LPAREN) {
    yield [...s_expression(tokens)];
  } else if (c === RPAREN) {
    return;
  } else if (_.isUndefined(c)) {
    return;
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

  // Parse strings, stripping double quotes.
  if (token[0] === '"') {
    return token.replace(/"/g, '');;
  }
  
  return new Sym(token);
};

const parse = program => s_expression(tokenize(program))
export default parse;
