import { run } from '../src/lisp.js';
import { expect } from 'chai';

describe('lisp', function () {
  const ftests = [
    ['(+ 3 3)', 6],
    ['(- 3 3)', 0],
    ['(* 3 3)', 9],
    ['(/ 12 3)', 4],
    ['(inc 3)', 4],
    ['(reduce (list 2 3 4) +)', 9],
    ['(map (list 2 3 4) inc)', [3, 4, 5]],
    ['(map (list 2 3 4) dec)', [1, 2, 3]],

    ['(eq? 2 3)', false],
    ['(eq? 3 3)', true],
    ['(procedure? (lambda (x) (+ x x)))', true],
    ['(procedure? 5)', false],
    ['(if 0 1 2)', 2],
    ['(if 1 1 2)', 1],

    ['(list 2 3 4)', [2, 3, 4]],
    ['(car (list 2 3 4))', 2],
    ['(cdr (list 2 3 4))', [3, 4]],
    ['(cons (list 2 3 4) 5)', [2, 3, 4, 5]],
     
    ['(define double (lambda (x) (+ x x)))', undefined],
    ['(begin (define r 6) (* r r))', 36],
    ['(begin (define r 10) (define pi 3.14) (* pi (* r r)))', 314],
    [`(begin
        (define r 5)
        (define square (lambda (x) (* x x)))
        (square (square r)))`, 625],
  ];
  ftests.forEach(([form, value]) => {
    it(`evaluates ${form}`, function() {
      expect(run(form)).to.deep.equal(value);
    });
  });

});

