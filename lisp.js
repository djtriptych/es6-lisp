import _ from 'lodash';
import parse, { Sym, Environment } from './parse';

/******************************************************************************/

// Front end.
const tokenize = source => 
  source
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .trim()
    .split(/\s+/);

const read_from_tokens = tokens => {
  if (_.isEmpty(tokens)) {
    throw 'Unexpected EOF.';
  }
  let token = tokens.shift();
  if ('(' === token) {
    let L = [];
    while (tokens[0] !== ')') {
      L.push(read_from_tokens(tokens));
    }
    tokens.shift();
    return L;
  } else if (')' === token) {
    throw 'Unexpected )';
  } else {
    return atom(token);
  }
};

const atom = token => {
  if (_.isFinite(_.toNumber(token))) {
    if (_.parseInt(token) == _.toNumber(token)) {
      return parseInt(token, 10);
    }
    return parseFloat(token);
  }
  return new String(token);
};

/******************************************************************************/
// Environment and eval.
const builtins = () => {
  return {
    '+'          : (x, y) => x + y,
    '-'          : (x, y) => x - y,
    '/'          : (x, y) => x / y,
    '*'          : (x, y) => x * y,
    '%'          : (x, y) => x % y,
    '<='         : (x, y) => x <= y,
    'begin'      : (...x) => _.last(x),
    'car'        : (x) => x[0],
    'cdr'        : _.tail,
    'cons'       : _.concat,
    'dec'        : (x) => x - 1,
    'eq?'        : (x, y) => x === y,
    'equal?'     : (x, y) => x == y,
    'inc'        : (x) => x + 1,
    'length'     : (x) => x.length,
    'list'       : (...x) => x,
    'list?'      : _.isArray,
    'map'        : _.map,
    'max'        : _.max,
    'min'        : _.min,
    'not'        : (x) => !x,
    'null?'      : _.isEmpty,
    'number?'    : _.isFinite,
    'procedure?' : _.isFunction,
    'reduce'     : _.reduce,
    'round'      : _.round,
    'symbol?'    : (x) => typeof x === 'symbol',
  };
};

const GLOBAL_ENV = builtins();

const Procedure = (params, body, env) => (...args) => {
  const penv = {};
  Object.keys(env).forEach(key => {
    penv[key] = env[key];
  });
  _.zip(params, args).forEach(
      _.spread((param, arg) => { penv[param] = arg; }));
  return evaluate(body, penv);
};

const evaluate = (x, env=GLOBAL_ENV) => {

  // A reference to a value in the environment.
  if (x instanceof String) {
    return env[x];
  }

  // A literal.
  else if (!_.isArray(x)) {
    return x;

  // Special forms.
  } else if(x[0] == 'if') {
    const [_, test, conseq, alt] = x;
    const exp = evaluate(test, env) ? conseq : alt;
    return evaluate(exp, env);
  } else if(x[0] == 'define') {
    const [_, name, exp] = x;
    env[name] = evaluate(exp, env);
  } else if(x[0] == 'lambda') {
    const [_, params, body] = x;
    return Procedure(params, body, env);

  // Function application.
  } else {
    const proc = evaluate(x[0], env);
    const args = _.map(x.slice(1), x => evaluate(x, env));
    return proc(...args);
  }
};

const run = program => evaluate(parse(program));

export {
  run, parse, evaluate, read_from_tokens, tokenize
}
