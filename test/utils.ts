import type { Expression } from '../src/public';
import { LatexSyntax, ComputeEngine, parseCortex } from '../src/math-json';
import { Form } from '../src/compute-engine/public';

let errors: string[] = [];

const defaultLatex = new LatexSyntax({
  onError: (err) => errors.push(err.code + (err.arg ? ' ' + err.arg : '')),
});
const rawLatex = new LatexSyntax({
  invisibleOperator: '',
  parseArgumentsOfUnknownLatexCommands: false,
  invisiblePlusOperator: '',
  promoteUnknownSymbols: /./,
  dictionary: [],
});
export const engine = new ComputeEngine();
export function expression(
  latex: string,
  options?: { form: Form }
): Expression {
  errors = [];
  const result = engine.format(defaultLatex.parse(latex), options?.form);
  errors = errors.filter((x) => !/^unknown-symbol /.test(x));
  if (errors.length !== 0) return [result, ...errors];
  return result;
}

export function latex(expr: Expression): string {
  errors = [];
  const result = defaultLatex.serialize(expr);
  errors = errors.filter((x) => !/^unknown-symbol /.test(x));
  if (errors.length !== 0) return errors.join('\n');
  return result;
}

export function expressionError(latex: string): string | string[] {
  errors = [];
  defaultLatex.parse(latex);
  return errors.length === 1 ? errors[0] : errors;
}

export function rawExpression(latex: string): Expression {
  errors = [];
  return JSON.stringify(engine.format(rawLatex.parse(latex), ['full']));
}

export function printExpression(expr: Expression): string {
  if (Array.isArray(expr)) {
    return '[' + expr.map((x) => printExpression(x)).join(', ') + ']';
  }
  if (typeof expr === 'string') {
    if (!expr) return "''";
    return "'" + expr + "'";
  }
  if (typeof expr === 'undefined') {
    return 'undefined';
  }
  if (expr === null) {
    return 'null';
  }
  if (typeof expr === 'object') {
    return (
      '{' +
      Object.keys(expr)
        .map((x) => x + ': ' + printExpression(expr[x]))
        .join(', ') +
      '}'
    );
  }
  return expr.toString();
}

// beforeEach(() => {
//   jest.spyOn(console, 'assert').mockImplementation((assertion) => {
//     if (!assertion) debugger;
//   });
//   jest.spyOn(console, 'log').mockImplementation(() => {
//     debugger;
//   });
//   jest.spyOn(console, 'warn').mockImplementation(() => {
//     debugger;
//   });
//   jest.spyOn(console, 'info').mockImplementation(() => {
//     debugger;
//   });
// });
expect.addSnapshotSerializer({
  // test: (val): boolean => Array.isArray(val) || typeof val === 'object',
  test: (_val): boolean => true,

  serialize: (val, _config, _indentation, _depth, _refs, _printer): string => {
    return printExpression(val);
  },
});

export function validCortex(s: string): Expression {
  const [value, error] = parseCortex(s);
  return (error?.code as any) ?? value;
}

export function invalidCortex(s: string): (string | number)[] {
  const [value, error] = parseCortex(s);
  if (!error) return ['succeeded-unexpectedly', value as any];
  return error.code as any;
}
