import { expect } from 'chai';
import Sym from '../src/sym.js';

describe('Sym', function () {
  it('should compare for strict equality', function () {
    expect(new Sym('a')).to.equal(new Sym('a'));
  });
});

