import { expect } from 'chai';
import Environment from '../src/environment.js';
import Sym from '../src/sym.js';

describe('Environment', function () {
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

