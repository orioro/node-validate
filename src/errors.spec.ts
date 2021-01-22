import {
  parallelCases,
  sequentialCases,
  validateThrow,
  ValidationError
} from './index'

const INVALID_NUMBER_COND = ['$eq', 'number', ['$type']]
const INVALID_NUMBER_ERR = {
  code: 'INVALID_NUMBER_ERR',
  message: 'Must be a number'
}

const OUT_OF_RANGE_COND = ['$and', [
  ['$gte', 1],
  ['$lte', 10]
]]
const OUT_OF_RANGE_ERR = {
  code: 'OUT_OF_RANGE_ERR',
  message: 'Must be a number between 1 and 10'
}

const NOT_EVEN_COND = ['$eq', 0, ['$mathMod', 2]]
const NOT_EVEN_ERR = {
  code: 'NOT_EVEN_ERR',
  message: 'Must be an even number'
}

describe('validateThrow(validation, value, options)', () => {
  test('parallelCases', () => {
    const validation = parallelCases([
      [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
      [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
      [NOT_EVEN_COND, NOT_EVEN_ERR]
    ])

    const expectations = [
      [null, TypeError],
      [undefined, TypeError],
      [10, null],
      [8, null],
      [0, ValidationError],
      [11, ValidationError],
      [7, ValidationError]
    ]

    expectations.forEach(([input, Expected]) => {
      if (Expected === null) {
        expect(validateThrow(validation, input)).toEqual(undefined)
      } else {
        expect(() => validateThrow(validation, input)).toThrow(Expected)
      }
    })
  })

  test('sequentialCases', () => {
    const validation = sequentialCases([
      [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
      [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
      [NOT_EVEN_COND, NOT_EVEN_ERR]
    ])

    const expectations = [
      [null, ValidationError],
      [undefined, ValidationError],
      [10, null],
      [8, null],
      [0, ValidationError],
      [11, ValidationError],
      [7, ValidationError]
    ]

    expectations.forEach(([input, Expected]) => {
      if (Expected === null) {
        expect(validateThrow(validation, input)).toEqual(undefined)
      } else {
        expect(() => validateThrow(validation, input)).toThrow(Expected)
      }
    })
  })
})
