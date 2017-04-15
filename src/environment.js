export class UnknownSymbol extends Error {};
export default class Environment {

  constructor(dict) {
    this.dict = dict;
    this.parent = null;
  }

  lookup(symbol) {
    const key = symbol.name;
    if (key in this.dict) {
      return this.dict[symbol.name];
    } else if (this.parent) {
      return this.parent.lookup(symbol);
    } else {
      throw new UnknownSymbol(symbol.name)
    }
  }

}
