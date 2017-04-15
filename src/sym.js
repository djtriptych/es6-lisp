export default class Sym {

  static map = {};

  constructor(name) {
    if (Sym.map[name]) {
      return Sym.map[name];
    } else  {
      this.name = name;
      Sym.map[name] = this;
    }
  }

  toString() {
    return `Sym: ${this.name}`
  }

  valueOf = toString;
}
