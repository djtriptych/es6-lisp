import { s_expression, tokenize } from '../src/parse.js';
import { expect } from 'chai';

describe('parser', function () {

  describe('tokenize', function () {
    const ftests = [
      ['()', ['(', ')']],
      [' () ', ['(', ')']],
      ['(a b', ['(', 'a', 'b']],
      ['(+ (+ 3 3) 4)', ['(', '+', '(', '+', '3', '3', ')', '4', ')']],
    ];
    ftests.forEach(([form, expected]) => {
      it(form, function() {
        expect([...tokenize(form)]).to.deep.equal(expected);
        return true;
      });
    })
  });

  describe('parse', function () {
    const ftests = [
      ['()', []],
      ['(())', [[]]],
      ['((1))', [[1]]],
    ];
    ftests.forEach(([form, expected]) => {
      it(form, function() {
        const val = s_expression(tokenize(form)).next().value;
        expect(val).to.deep.equal(expected);
      });
    })
    it('should fail on bad input', function() {
      const input = '(';
      expect(s_expression(tokenize(input)).next).to.throw;
    });
    it('should fail on bad input', function() {
      const input = ')';
      expect(s_expression(tokenize(input)).next).to.throw;
    });
  });

});

