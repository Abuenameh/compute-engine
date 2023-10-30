import { BoxedExpression } from '../public';

/**
 * Flatten the arguments.
 */

export function flattenOps(
  ops: BoxedExpression[],
  head: string
): BoxedExpression[] {
  if (!head) return ops;
  // Bypass memory allocation for the common case where there is nothing to flatten
  if (ops.every((x) => !x.ops || x.head !== head)) return ops;

  const result: BoxedExpression[] = [];
  for (const arg of ops) {
    if (!arg.ops || arg.head !== head) result.push(arg);
    else {
      // ["f", a, ["f", b, c]] -> ["f", a, b, c]
      // or ["f", ["f", a]] -> ["f", a]
      result.push(...flattenOps(arg.ops, head));
    }
  }

  // If number of arguments didn't change, we didn't flatten
  console.assert(result.length !== ops.length); // @todo check below may not be necessary
  if (result.length === ops.length) return ops;

  return result;
}

export function flattenSequence(xs: BoxedExpression[]): BoxedExpression[] {
  // Bypass memory allocation for the common case where there are no sequences or delimiters
  if (xs.every((x) => x.head !== 'Sequence' && x.head !== 'Delimiter'))
    return xs;

  const ys: BoxedExpression[] = [];
  for (const x of xs) {
    if (!x.isValid) ys.push(x);
    else if (x.head === 'Delimiter') {
      const seq = x.op1.ops ?? [];
      // If this is an empty delimiter, i.e. `()`, preserve it as a tuple, don't flatten it.
      if (seq.length === 0) ys.push(x.engine.box(['Tupple']));
      else ys.push(...flattenSequence(seq));
    } else if (x.head === 'Sequence') {
      if (x.ops) ys.push(...x.ops);
    } else ys.push(x);
  }
  return ys;
}
