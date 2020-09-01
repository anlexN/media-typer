
const assert = require('assert')
const typer = require('..')

const invalidTypes = [
  ' ',
  'null',
  'undefined',
  '/',
  'text/;plain',
  'text/"plain"',
  'text/p£ain',
  'text/(plain)',
  'text/@plain',
  'text/plain,wrong'
]

describe('typer.format(obj)', () => {
  it('should format basic type', () => {
    const str = typer.format({ type: 'text', subtype: 'html' })
    assert.strictEqual(str, 'text/html')
  })

  it('should format type with suffix', () => {
    const str = typer.format({ type: 'image', subtype: 'svg', suffix: 'xml' })
    assert.strictEqual(str, 'image/svg+xml')
  })

  it('should require argument', () => {
    assert.throws(typer.format.bind(null), /obj.*required/)
  })

  it('should reject non-objects', () => {
    assert.throws(typer.format.bind(null, 7), /obj.*required/)
  })

  it('should require type', () => {
    assert.throws(typer.format.bind(null, {}), /invalid type/)
  })

  it('should reject invalid type', () => {
    assert.throws(typer.format.bind(null, { type: 'text/' }), /invalid type/)
  })

  it('should require subtype', () => {
    assert.throws(typer.format.bind(null, { type: 'text' }), /invalid subtype/)
  })

  it('should reject invalid subtype', () => {
    const obj = { type: 'text', subtype: 'html/' }
    assert.throws(typer.format.bind(null, obj), /invalid subtype/)
  })

  it('should reject invalid suffix', () => {
    const obj = { type: 'image', subtype: 'svg', suffix: 'xml\\' }
    assert.throws(typer.format.bind(null, obj), /invalid suffix/)
  })
})

describe('typer.parse(string)', () => {
  it('should parse basic type', () => {
    const type = typer.parse('text/html')
    assert.strictEqual(type.type, 'text')
    assert.strictEqual(type.subtype, 'html')
  })

  it('should parse with suffix', () => {
    const type = typer.parse('image/svg+xml')
    assert.strictEqual(type.type, 'image')
    assert.strictEqual(type.subtype, 'svg')
    assert.strictEqual(type.suffix, 'xml')
  })

  it('should lower-case type', () => {
    const type = typer.parse('IMAGE/SVG+XML')
    assert.strictEqual(type.type, 'image')
    assert.strictEqual(type.subtype, 'svg')
    assert.strictEqual(type.suffix, 'xml')
  })

  invalidTypes.forEach((type) => {
    it(`should throw on invalid media type ${JSON.stringify(type)}`, () => {
      assert.throws(typer.parse.bind(null, type), /invalid media type/)
    })
  })

  it('should require argument', () => {
    assert.throws(typer.parse.bind(null), /string.*required/)
  })

  it('should reject non-strings', () => {
    assert.throws(typer.parse.bind(null, 7), /string.*required/)
  })
})

describe('typer.test(string)', () => {
  it('should pass basic type', () => {
    assert.strictEqual(typer.test('text/html'), true)
  })

  it('should pass with suffix', () => {
    assert.strictEqual(typer.test('image/svg+xml'), true)
  })

  it('should pass upper-case type', () => {
    assert.strictEqual(typer.test('IMAGE/SVG+XML'), true)
  })

  invalidTypes.forEach((type) => {
    it(`should fail invalid media type ${JSON.stringify(type)}`, () => {
      assert.strictEqual(typer.test(type), false)
    })
  })

  it('should require argument', () => {
    assert.throws(typer.test.bind(null), /string.*required/)
  })

  it('should reject non-strings', () => {
    assert.throws(typer.test.bind(null, 7), /string.*required/)
  })
})
