
import { Sym, Environment, s_expression, tokenize } from '../parse.js';
import { expect } from 'chai';

describe('Sym', function () {
  it('should compare for strict equality', function () {
    expect(new Sym('a')).to.equal(new Sym('a'));
  });
});

describe.only('Environment', function () {
  it('should lookup with symbols', function () {
    const env = new Environment({foo: 1});
    expect(env.lookup(new Sym('foo'))).to.equal(1);
  });

  it('should set values', function () {
    const env = new Environment({foo: 1});
    expect(env.lookup(new Sym('foo'))).to.equal(1);
  });

  it('should lookup in parent environments', function () {
    const a = new Environment({foo: 1});
    const b = new Environment({bar: 2});
    const c = new Environment({baz: 3});
    a.parent = b;
    b.parent = c;
    expect(a.lookup(new Sym('foo'))).to.equal(1);
    expect(a.lookup(new Sym('bar'))).to.equal(2);
    expect(a.lookup(new Sym('baz'))).to.equal(3);
  });

  it('should throw exception if symbol not found in lookup', function () {
    const a = new Environment({foo: 1});
    const b = new Environment({bar: 2});
    a.parent = b;
    expect(a.lookup.bind(null, new Sym('baz'))).to.throw;
    expect(b.lookup.bind(null, new Sym('foo'))).to.throw;
  });

});


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

