/*!
 * media-typer
 * Copyright(c) 2014-2017 Douglas Christopher Wilson; 2020 anlexN
 * MIT Licensed
 */

'use strict'

/**
 * RegExp to match type in RFC 6838
 *
 * type-name = restricted-name
 * subtype-name = restricted-name
 * restricted-name = restricted-name-first *126restricted-name-chars
 * restricted-name-first  = ALPHA / DIGIT
 * restricted-name-chars  = ALPHA / DIGIT / "!" / "#" /
 *                          "$" / "&" / "-" / "^" / "_"
 * restricted-name-chars =/ "." ; Characters before first dot always
 *                              ; specify a facet name
 * restricted-name-chars =/ "+" ; Characters after last plus always
 *                              ; specify a structured syntax suffix
 * ALPHA =  %x41-5A / %x61-7A   ; A-Z / a-z
 * DIGIT =  %x30-39             ; 0-9
 */

const TYPE_NAME_REGEXP = /^[A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126}$/
const SUBTYPE_NAME_REGEXP = /^[A-Za-z0-9][A-Za-z0-9!#$&^_.-]{0,126}$/
const TYPE_REGEXP = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/

/**
 * Format object to media type.
 *
 * @param {Object} obj
 * @param {string} obj.type
 * @param {string} obj.subtype
 * @param {string} obj.suffix
 * @return {string}
 * @public
 */

function format (obj) {
  if (!obj || typeof obj !== 'object') {
    throw new TypeError('argument obj is required')
  }

  const { type, subtype, suffix } = obj

  if (!type || !TYPE_NAME_REGEXP.test(type)) {
    throw new TypeError('invalid type')
  }

  if (!subtype || !SUBTYPE_NAME_REGEXP.test(subtype)) {
    throw new TypeError('invalid subtype')
  }

  // format as type/subtype
  let string = `${type}/${subtype}`

  // append +suffix
  if (suffix) {
    if (!TYPE_NAME_REGEXP.test(suffix)) {
      throw new TypeError('invalid suffix')
    }

    string += `+${suffix}`
  }

  return string
}

/**
 * Test media type.
 *
 * @param {string} string
 * @return {object}
 * @public
 */

function test (string) {
  if (!string) {
    throw new TypeError('argument string is required')
  }

  if (typeof string !== 'string') {
    throw new TypeError('argument string is required to be a string')
  }

  return TYPE_REGEXP.test(string.toLowerCase())
}

/**
 * Parse media type to object.
 *
 * @param {string} string
 * @return {object}
 * @public
 */

function parse (string) {
  if (!string) {
    throw new TypeError('argument string is required')
  }

  if (typeof string !== 'string') {
    throw new TypeError('argument string is required to be a string')
  }

  // const match = TYPE_REGEXP.exec(string.toLowerCase())
  const match = string.toLowerCase().match(TYPE_REGEXP)

  if (!match) {
    throw new TypeError('invalid media type')
  }

  const type = match[1]
  let subtype = match[2]
  let suffix = null

  // suffix after last +
  const index = subtype.lastIndexOf('+')
  if (index !== -1) {
    suffix = subtype.substring(index + 1)
    subtype = subtype.substring(0, index)
  }

  return { type, subtype, suffix }
}

module.exports = { format, parse, test }
