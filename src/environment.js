export class UnknownSymbol extends Error {};
export default class Environment {

  constructor(dict) {
    this.parent = null;
    this.dict = dict;
  }

  set(symbol, value) {
    this.dict[symbol.name] = value;
  }

  lookup(symbol) {
    const key = symbol.name;
    if (key in this.dict) {
      return this.dict[symbol.name];
    } else if (this.parent) {
      return this.parent.lookup(symbol);
    } else {
      throw new UnknownSymbol(`No symbol "${symbol.name}"`);
    }
  }

}
