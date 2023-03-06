export abstract class CommandInput<T = any> {
  _?: T;
  abstract name: string;
  abstract description: string;
  abstract required: boolean;

  abstract validate(input: string): boolean;
  abstract parse(input: string): T;
}
