import {
  validate,
  sequentialCases,
  parallelCases,
  allowValues,
  prohibitValues
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

describe('sequentialCases(cases)', () => {
  test('', () => {
    const validation = sequentialCases([
      [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
      [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
      [NOT_EVEN_COND, NOT_EVEN_ERR]
    ])

    const expectations = [
      [null, [INVALID_NUMBER_ERR]],
      [undefined, [INVALID_NUMBER_ERR]],
      [10, null],
      [0, [OUT_OF_RANGE_ERR]],
      [11, [OUT_OF_RANGE_ERR]]
    ]

    expectations.forEach(([input, expected]) => {
      expect(validate(validation, input)).toEqual(expected)
    })
  })

  test('empty cases (should always return valid)', () => {
    const validation = sequentialCases([])

    const expectations = [
      [null, null],
      [undefined, null],
      [10, null],
      [0, null],
      [11, null]
    ]

    expectations.forEach(([input, expected]) => {
      expect(validate(validation, input)).toEqual(expected)
    })
  })
})

describe('parallelCases(cases)', () => {
  test('', () => {
    const validation = parallelCases([
      [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
      [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
      [NOT_EVEN_COND, NOT_EVEN_ERR]
    ])

    const expectations = [
      [null, TypeError],
      [undefined, TypeError],
      [10, null],
      [0, [OUT_OF_RANGE_ERR]],
      [11, [OUT_OF_RANGE_ERR, NOT_EVEN_ERR]]
    ]

    expectations.forEach(([input, expected]) => {
      if (expected === TypeError) {
        expect(() => validate(validation, input)).toThrow(TypeError)
      } else {
        expect(validate(validation, input)).toEqual(expected)
      }
    })
  })

  test('empty cases (should always return valid)', () => {
    const validation = parallelCases([])

    const expectations = [
      [null, null],
      [undefined, null],
      [10, null],
      [0, null],
      [11, null]
    ]

    expectations.forEach(([input, expected]) => {
      expect(validate(validation, input)).toEqual(expected)
    })
  })
})

describe('allowValues', () => {

  test('null', () => {
    const validation = allowValues([null], parallelCases([
      [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
      [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
      [NOT_EVEN_COND, NOT_EVEN_ERR]
    ]))

    const expectations = [
      [null, null],
      [undefined, TypeError],
      [10, null],
      [0, [OUT_OF_RANGE_ERR]],
      [11, [OUT_OF_RANGE_ERR, NOT_EVEN_ERR]]
    ]

    expectations.forEach(([input, expected]) => {
      if (expected === TypeError) {
        expect(() => validate(validation, input)).toThrow(TypeError)
      } else {
        expect(validate(validation, input)).toEqual(expected)
      }
    })
  })

  test('undefined', () => {
    const validation = allowValues([undefined], parallelCases([
      [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
      [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
      [NOT_EVEN_COND, NOT_EVEN_ERR]
    ]))

    const expectations = [
      [null, TypeError],
      [undefined, null],
      [10, null],
      [0, [OUT_OF_RANGE_ERR]],
      [11, [OUT_OF_RANGE_ERR, NOT_EVEN_ERR]]
    ]

    expectations.forEach(([input, expected]) => {
      if (expected === TypeError) {
        expect(() => validate(validation, input)).toThrow(TypeError)
      } else {
        expect(validate(validation, input)).toEqual(expected)
      }
    })
  })

  test('null and undefined', () => {
    const validation = allowValues([null, undefined], parallelCases([
      [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
      [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
      [NOT_EVEN_COND, NOT_EVEN_ERR]
    ]))

    const expectations = [
      [null, null],
      [undefined, null],
      [10, null],
      [0, [OUT_OF_RANGE_ERR]],
      [11, [OUT_OF_RANGE_ERR, NOT_EVEN_ERR]]
    ]

    expectations.forEach(([input, expected]) => {
      expect(validate(validation, input)).toEqual(expected)
    })
  })
})

describe('prohibitValues(values, error, validation)', () => {
  test('', () => {
    const validation = prohibitValues([undefined, null], 'REQUIRED_ERROR', parallelCases([
      [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
      [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
      [NOT_EVEN_COND, NOT_EVEN_ERR]
    ]))

    const expectations = [
      [null, [{ code: 'REQUIRED_ERROR' }]],
      [undefined, [{ code: 'REQUIRED_ERROR'}]],
      [10, null],
      [0, [OUT_OF_RANGE_ERR]],
      [11, [OUT_OF_RANGE_ERR, NOT_EVEN_ERR]]
    ]

    expectations.forEach(([input, expected]) => {
      expect(validate(validation, input)).toEqual(expected)
    })
  })
})
