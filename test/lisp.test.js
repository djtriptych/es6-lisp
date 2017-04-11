import { parse, evaluate} from '../lisp.js';
import { expect } from 'chai';

describe('lisp', function () {
  let run;
  beforeEach(function () {
    run = program => evaluate(parse(program));
  });
  const tests = [
    ['(+ 3 3 )', 6],
    ['(- 3 3 )', 0],
    ['(* 3 3 )', 9],
    ['(/ 12 3 )', 4],
    ['(begin (define r 6) (* r r))', 36],
    ['(begin (define r 10) (define pi 3.14) (* pi (* r r)))', 314],
    [`(begin
        (define r 5)
        (define square (lambda (x) (* x x)))
        (square (square r)))`, 625],
  ];
  tests.forEach(([form, value]) => {
    it(form, function() {
      expect(run(form)).to.equal(value);
    });
  });
});


