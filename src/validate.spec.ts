import {
  validate,
  normalizeValidationResult
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

describe('validate(validation, value, options)', () => {
  test('sequential: returns null upon no errors, error object upon first error', () => {
    const validation = [
      '$switch',
      [
        [['$not', INVALID_NUMBER_COND], INVALID_NUMBER_ERR],
        [['$not', OUT_OF_RANGE_COND], OUT_OF_RANGE_ERR],
        [['$not', NOT_EVEN_COND], NOT_EVEN_ERR]
      ],
      null
    ]

    const expectations = [
      [null, [INVALID_NUMBER_ERR]],
      [undefined, [INVALID_NUMBER_ERR]],
      [10, null],
      [8, null],
      [0, [OUT_OF_RANGE_ERR]],
      [11, [OUT_OF_RANGE_ERR]],
      [7, [NOT_EVEN_ERR]]
    ]

    expectations.forEach(([input, expected]) => {
      expect(validate(validation, input)).toEqual(expected)
    })
  })

  test('parallel: returning multiple errors at once', () => {
    const validation = [
      '$pipe',
      [
        [
          '$arrayMap',
          [
            '$if',
            ['$evaluate', ['$value', '0'], ['$value', '$$PARENT_SCOPE']],
            null,
            ['$value', '1']
          ],
          [
            [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
            [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
            [NOT_EVEN_COND, NOT_EVEN_ERR]
          ]
        ],
        [
          '$arrayFilter',
          ['$notEq', null]
        ]
      ],
    ]

    const expectations = [
      [10, null],
      [8, null],
      [0, [OUT_OF_RANGE_ERR]],
      [11, [OUT_OF_RANGE_ERR, NOT_EVEN_ERR]],
      [7, [NOT_EVEN_ERR]]
    ]

    expectations.forEach(([input, expected]) => {
      expect(validate(validation, input)).toEqual(expected)
    })
  })

  test('omitting error messages', () => {
    const validation = [
      '$switch',
      [
        [['$not', INVALID_NUMBER_COND], 'INVALID_NUMBER_ERR'],
        [['$not', OUT_OF_RANGE_COND], 'OUT_OF_RANGE_ERR']
      ],
      null
    ]

    const expectations = [
      [null, [{ code: 'INVALID_NUMBER_ERR' }]],
      [undefined, [{ code: 'INVALID_NUMBER_ERR' }]],
      [10, null],
      [0, [{ code: 'OUT_OF_RANGE_ERR' }]],
      [11, [{ code: 'OUT_OF_RANGE_ERR' }]]
    ]

    expectations.forEach(([input, expected]) => {
      expect(validate(validation, input)).toEqual(expected)
    })
  })
})

describe('normalizeValidationResult(result)', () => {
  test('null', () => {
    expect(normalizeValidationResult(null)).toEqual(null)
  })

  test('[] - empty array', () => {
    expect(normalizeValidationResult([])).toEqual(null)
  })

  test('\'ERROR_CODE\' - single string format error code', () => {
    expect(normalizeValidationResult('ERROR_CODE'))
      .toEqual([
        { code: 'ERROR_CODE' }
      ])
  })

  test('{ code: \'ERROR_CODE\' } - single object error spec', () => {
    expect(normalizeValidationResult({
      code: 'ERROR_CODE'
    }))
    .toEqual([
      { code: 'ERROR_CODE' }
    ])
  })

  test('[\'ERROR_CODE\', { code: \'ANOTHER_ERROR_CODE\'}] - multiple errors in different formats', () => {
    expect(normalizeValidationResult([
      'ERROR_CODE',
      { code: 'ANOTHER_ERROR_CODE', message: 'Some error message' }
    ])).toEqual([
      { code: 'ERROR_CODE' },
      { code: 'ANOTHER_ERROR_CODE', message: 'Some error message' }
    ])
  })
})
