import _ from 'lodash';

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
  return Symbol.for(token);
};

const parse = program => read_from_tokens(tokenize(program))

/******************************************************************************/
// Environment and eval.
const builtins = () => {
  const env = {};
  _({
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
  }).forEach( (value, key) => env[Symbol.for(key)] = value)
  return env;
};

const GLOBAL_ENV = builtins();

const Procedure = (params, body, env) => (...args) => {
  const penv = {};
  Object.getOwnPropertySymbols(env).forEach(key => {
    penv[key] = env[key];
  });
  _.zip(params, args).forEach(
      _.spread((param, arg) => { penv[param] = arg; }));
  return evaluate(body, penv);
};

const evaluate = (x, env=GLOBAL_ENV) => {
  if (typeof x === 'symbol') {
    return env[x];
  }
  else if (!_.isArray(x)) {
    return x;
  } else if(x[0] === Symbol.for('if')) {
    const [_, test, conseq, alt] = x;
    const exp = evaluate(test, env) ? conseq : alt;
    return evaluate(exp, env);
  } else if(x[0] === Symbol.for('define')) {
    const [_, name, exp] = x;
    env[name] = evaluate(exp, env);
  } else if(x[0] === Symbol.for('lambda')) {
    const [_, params, body] = x;
    return Procedure(params, body, env);
  } else {
    const proc = evaluate(x[0], env);
    const args = _.map(x.slice(1), x => evaluate(x, env));
    return proc(...args);
  }
};

export {
  parse, evaluate
}
