import _ from 'lodash';
import parse from './parse';
import Sym from './sym';
import Environment from './environment';

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

const GLOBAL_ENV = new Environment(builtins());

const SPECIAL = {
  IF: new Sym('if'),
  DEFINE: new Sym('define'),
  LAMBDA: new Sym('lambda'),
};

const Procedure = (params, body, env) => (...args) => {
  const bound = _.fromPairs(_.zip(_.map(params, 'name'), args));
  const penv = new Environment(bound);
  penv.parent = env;
  return evaluate(body, penv);
};

const evaluate = (x, env=GLOBAL_ENV) => {

  // A reference to a value in the environment.
  if (x instanceof Sym) {
    return env.lookup(x);
  }

  // A literal.
  else if (!_.isArray(x)) {
    return x;

  // Special forms.
  } else if(x[0] === SPECIAL.IF) {
    const [_, test, conseq, alt] = x;
    const exp = evaluate(test, env) ? conseq : alt;
    return evaluate(exp, env);
  } else if(x[0] === SPECIAL.DEFINE) {
    const [_, name, exp] = x;
    env.set(name, evaluate(exp, env));
  } else if(x[0] === SPECIAL.LAMBDA) {
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
  run
}
