class Prefixer {
  private readonly prefix: any;

  private readonly delimiter: any;

  constructor(prefix: string, { delimiter = '' }: any) {
    this.prefix = prefix;
    this.delimiter = delimiter;
  }

  applyTo(value: any) {
    return `${this.prefix}${this.delimiter}${value}`;
  }
}

export default Prefixer;
