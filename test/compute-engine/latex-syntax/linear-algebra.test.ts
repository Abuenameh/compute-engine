import { engine as ce } from '../../utils';

const m4 = ['List', ['List', 1, 2], ['List', 3, 4]];

describe('Parsing environments', () => {
  it('should parse a pmatrix', () => {
    const result = ce.parse('\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}');
    expect(result.toString()).toMatchInlineSnapshot(
      `["Error",["ErrorCode","'unknown-environment'","'pmatrix'"],["LatexString","'\\\\begin{pmatrix} a & b \\\\\\\\ c & d \\\\end{pmatrix}'"]]`
    );
  });

  it('should parse a pmatrix with optional column format', () => {
    const result = ce.parse(
      '\\begin{pmatrix}[ll] a & b \\\\ c & d \\end{pmatrix}'
    );
    expect(result.toString()).toMatchInlineSnapshot(
      `["Error",["ErrorCode","'unknown-environment'","'pmatrix'"],["LatexString","'\\\\begin{pmatrix}[ll] a & b \\\\\\\\ c & d \\\\end{pmatrix}'"]]`
    );
  });

  it('should parse a bmatrix', () => {
    const result = ce.parse('\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}');
    expect(result.toString()).toMatchInlineSnapshot(
      `["Error",["ErrorCode","'unknown-environment'","'bmatrix'"],["LatexString","'\\\\begin{bmatrix} a & b \\\\\\\\ c & d \\\\end{bmatrix}'"]]`
    );
  });

  it('should parse a Bmatrix', () => {
    const result = ce.parse('\\begin{Bmatrix} a & b \\\\ c & d \\end{Bmatrix}');
    expect(result.toString()).toMatchInlineSnapshot(
      `["Error",["ErrorCode","'unknown-environment'","'Bmatrix'"],["LatexString","'\\\\begin{Bmatrix} a & b \\\\\\\\ c & d \\\\end{Bmatrix}'"]]`
    );
  });

  it('should parse a vmatrix', () => {
    const result = ce.parse('\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}');
    expect(result.toString()).toMatchInlineSnapshot(
      `["Error",["ErrorCode","'unknown-environment'","'vmatrix'"],["LatexString","'\\\\begin{vmatrix} a & b \\\\\\\\ c & d \\\\end{vmatrix}'"]]`
    );
  });

  it('should parse a Vmatrix', () => {
    const result = ce.parse('\\begin{Vmatrix} a & b \\\\ c & d \\end{Vmatrix}');
    expect(result.toString()).toMatchInlineSnapshot(
      `["Error",["ErrorCode","'unknown-environment'","'Vmatrix'"],["LatexString","'\\\\begin{Vmatrix} a & b \\\\\\\\ c & d \\\\end{Vmatrix}'"]]`
    );
  });

  it('should parse a dcases', () => {
    const result = ce.parse('\\begin{dcases} a & b \\\\ c & d \\end{dcases}');
    expect(result.toString()).toMatchInlineSnapshot(
      `["Error",["ErrorCode","'unknown-environment'","'dcases'"],["LatexString","'\\\\begin{dcases} a & b \\\\\\\\ c & d \\\\end{dcases}'"]]`
    );
  });

  it('should parse a rcases', () => {
    const result = ce.parse('\\begin{rcases} a & b \\\\ c & d \\end{rcases}');
    expect(result.toString()).toMatchInlineSnapshot(
      `["Error",["ErrorCode","'unknown-environment'","'rcases'"],["LatexString","'\\\\begin{rcases} a & b \\\\\\\\ c & d \\\\end{rcases}'"]]`
    );
  });

  it('should parse an array', () => {
    const result = ce.parse('\\begin{array}{cc} a & b \\\\ c & d \\end{array}');
    expect(result.toString()).toMatchInlineSnapshot(
      `["Error",["ErrorCode","'unknown-environment'","'array'"],["LatexString","'\\\\begin{array}{cc} a & b \\\\\\\\ c & d \\\\end{array}'"]]`
    );
  });

  it('should parse a matrix environment', () => {
    const result = ce.parse('\\begin{matrix} a & b \\\\ c & d \\end{matrix}');
    expect(result.toString()).toMatchInlineSnapshot(
      `["Error",["ErrorCode","'unknown-environment'","'matrix'"],["LatexString","'\\\\begin{matrix} a & b \\\\\\\\ c & d \\\\end{matrix}'"]]`
    );
  });

  it('should parse an environment with custom delimiters', () => {
    const result = ce.parse(
      '\\left\\langle\\begin{matrix} a & b \\\\ c & d \\end{matrix}\\right\\rangle'
    );
    expect(result.toString()).toMatchInlineSnapshot(
      `["Error","'unexpected-delimiter'",["LatexString","'\\\\left\\\\langle'"]]`
    );
  });

  it('should parse an environment with custom delimiters', () => {
    const result = ce.parse(
      '\\left\\langle\\begin{array}{cc} a & b \\\\ c & d \\end{array}\\right\\rangle'
    );
    expect(result.toString()).toMatchInlineSnapshot(
      `["Error","'unexpected-delimiter'",["LatexString","'\\\\left\\\\langle'"]]`
    );
  });
});

describe('Serializing matrix with delimiters', () => {
  it('should parse a matrix with default delimiter', () => {
    const result = ce.box(['Matrix', m4]);
    expect(result.latex).toMatchInlineSnapshot(`
      \\begin{pmatrix}1 & 2\\\\
      3 & 4\\end{pmatrix}
    `);
  });

  it('should parse a matrix with () delimiters', () => {
    const result = ce.box(['Matrix', m4, { str: '()' }]);
    expect(result.latex).toMatchInlineSnapshot(`
      \\left\\begin{array}{}1 & 2\\\\
      3 & 4\\end{array}\\right
    `);
  });

  it('should parse a matrix with [] delimiters', () => {
    const result = ce.box(['Matrix', m4, { str: '[]' }]);
    expect(result.latex).toMatchInlineSnapshot(`
      \\left\\begin{array}{}1 & 2\\\\
      3 & 4\\end{array}\\right
    `);
  });

  it('should parse a matrix with {} delimiters', () => {
    const result = ce.box(['Matrix', m4, { str: '{}' }]);
    expect(result.latex).toMatchInlineSnapshot(`
      \\left\\begin{array}{}1 & 2\\\\
      3 & 4\\end{array}\\right
    `);
  });
  it('should parse a matrix with || delimiters', () => {
    const result = ce.box(['Matrix', m4, { str: '||' }]);
    expect(result.latex).toMatchInlineSnapshot(`
      \\left\\begin{array}{}1 & 2\\\\
      3 & 4\\end{array}\\right
    `);
  });
  it('should parse a matrix with ‖‖ delimiters', () => {
    const result = ce.box(['Matrix', m4, { str: '‖‖' }]);
    expect(result.latex).toMatchInlineSnapshot(`
      \\left\\begin{array}{}1 & 2\\\\
      3 & 4\\end{array}\\right
    `);
  });
  it('should parse a matrix with {. delimiters', () => {
    const result = ce.box(['Matrix', m4, { str: '{.' }]);
    expect(result.latex).toMatchInlineSnapshot(`
      \\left\\begin{array}{}1 & 2\\\\
      3 & 4\\end{array}\\right
    `);
  });
  it('should parse a matrix with .} delimiters', () => {
    const result = ce.box(['Matrix', m4, { str: '.}' }]);
    expect(result.latex).toMatchInlineSnapshot(`
      \\left\\begin{array}{}1 & 2\\\\
      3 & 4\\end{array}\\right
    `);
  });
  it('should parse a matrix with no delimiters', () => {
    const result = ce.box(['Matrix', m4, { str: '..' }]);
    expect(result.latex).toMatchInlineSnapshot(`
      \\left\\begin{array}{}1 & 2\\\\
      3 & 4\\end{array}\\right
    `);
  });
  it('should parse a matrix with <> delimiters', () => {
    const result = ce.box(['Matrix', m4, { str: '<>' }]);
    expect(result.latex).toMatchInlineSnapshot(`
      \\left\\begin{array}{}1 & 2\\\\
      3 & 4\\end{array}\\right
    `);
  });
});

describe('Serialazing matrix with column format', () => {
  it('should parse a matrix left aligned cells', () => {
    const result = ce.box(['Matrix', m4, { str: '[]' }, { str: '<<<<' }]);
    expect(result.latex).toMatchInlineSnapshot(`
      \\left\\begin{array}{llll}1 & 2\\\\
      3 & 4\\end{array}\\right
    `);
  });
  it('should parse a matrix centered aligned cells', () => {
    const result = ce.box(['Matrix', m4, { str: '[]' }, { str: '====' }]);
    expect(result.latex).toMatchInlineSnapshot(`
      \\left\\begin{array}{cccc}1 & 2\\\\
      3 & 4\\end{array}\\right
    `);
  });
  it('should parse a matrix right aligned cells', () => {
    const result = ce.box(['Matrix', m4, { str: '[]' }, { str: '>>>>' }]);
    expect(result.latex).toMatchInlineSnapshot(`
      \\left\\begin{array}{rrrr}1 & 2\\\\
      3 & 4\\end{array}\\right
    `);
  });
  it('should parse a matrix with mixed aligned cells', () => {
    const result = ce.box(['Matrix', m4, { str: '[]' }, { str: '>=<' }]);
    expect(result.latex).toMatchInlineSnapshot(`
      \\left\\begin{array}{rcl}1 & 2\\\\
      3 & 4\\end{array}\\right
    `);
  });
});