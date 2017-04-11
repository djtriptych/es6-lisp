import _ from 'lodash';

/******************************************************************************/
// Front end.
const tokenize = s => s.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').trim().split(/\s+/);

const read_from_tokens  = tokens => {
  if (_.isEmpty(tokens)) {
    throw 'Unexpected EOF while reading.';
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

const parse = program  => read_from_tokens(tokenize(program))


/******************************************************************************/
// Environment and eval.
const make_env = () => {
  const env = {};
  _({
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '/': (x, y) => x / y,
    '*': (x, y) => x * y,
    'begin': (...x) => _.last(x)
  }).forEach( (value, key) => env[Symbol.for(key)] = value)
  return env;
};

const GLOBAL_ENV= make_env();

const Procedure = (params, body, env) => (...args) =>  {
  const penv = {};
  Object.getOwnPropertySymbols(env).forEach(key => {
    penv[key] = env[key];
  });
  _.zip(params, args).forEach(
      _.spread((param, arg) => { penv[param] = arg; }));
  return evaluate(body, penv);
}

const evaluate = (x, env=GLOBAL_ENV) => {
  if (typeof x === 'symbol') {
    return env[x];
  }
  else if (!_.isArray(x)) {
    return x;
  } else if(x[0] === Symbol.for('if')) {
    const [_, test, conseq, alt] = x;
    const exp = evaluate(test, env) ? conseq : alt;
    return eval(exp, env);
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

/******************************************************************************/
// Test.
const program = '(begin (define r 10) (define pi 3.14159) (* pi (* r r)))';
const tokens = parse(program);

//console.log(tokens);
console.log(evaluate(parse('(define r 6)')));
console.log(evaluate(parse('(* r r)')));
console.log(evaluate(parse('(define square (lambda (x) (* x x)))')));
console.log(evaluate(parse('(square (square r))')));
console.log(evaluate(parse(program)));
