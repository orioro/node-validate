import { normalizeValidationResult } from './index'

import { ALL_EXPRESSIONS } from '@orioro/expression'

import { testCases } from '@orioro/jest-util'

import { _prepareTestFns } from '../spec/specUtil'
const testValidate = _prepareTestFns({
  ...ALL_EXPRESSIONS,
  $asyncEcho: {
    sync: null,
    async: (context, value) =>
      new Promise((resolve) => setTimeout(() => resolve(value), 50)),
  },
})

const SYNC_INVALID_NUMBER_COND = ['$eq', 'number', ['$type']]
const INVALID_NUMBER_ERR = {
  code: 'INVALID_NUMBER_ERR',
  message: 'Must be a number',
}

const SYNC_OUT_OF_RANGE_COND = [
  '$and',
  [
    ['$gte', 1],
    ['$lte', 10],
  ],
]
const OUT_OF_RANGE_ERR = {
  code: 'OUT_OF_RANGE_ERR',
  message: 'Must be a number between 1 and 10',
}

const SYNC_NOT_EVEN_COND = ['$eq', 0, ['$mathMod', 2]]
const NOT_EVEN_ERR = {
  code: 'NOT_EVEN_ERR',
  message: 'Must be an even number',
}

describe('validateSync / validateAsync(validation, value)', () => {
  describe('sequential: returns null upon no errors, error object upon first error', () => {
    const validation = [
      '$switch',
      [
        [['$not', SYNC_INVALID_NUMBER_COND], INVALID_NUMBER_ERR],
        [['$not', SYNC_OUT_OF_RANGE_COND], OUT_OF_RANGE_ERR],
        [['$not', SYNC_NOT_EVEN_COND], NOT_EVEN_ERR],
      ],
      null,
    ]

    testValidate([
      [validation, null, [INVALID_NUMBER_ERR]],
      [validation, undefined, [INVALID_NUMBER_ERR]],
      [validation, 10, null],
      [validation, 8, null],
      [validation, 0, [OUT_OF_RANGE_ERR]],
      [validation, 11, [OUT_OF_RANGE_ERR]],
      [validation, 7, [NOT_EVEN_ERR]],
    ])
  })

  describe('parallel: returning multiple errors at once', () => {
    const validation = [
      '$pipe',
      [
        [
          '$arrayMap',
          [
            '$if',
            ['$evaluate', ['$value', '0'], ['$value', '$$PARENT_SCOPE']],
            null,
            ['$value', '1'],
          ],
          [
            [SYNC_INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
            [SYNC_OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
            [SYNC_NOT_EVEN_COND, NOT_EVEN_ERR],
          ],
        ],
        ['$arrayFilter', ['$notEq', null]],
      ],
    ]

    testValidate([
      [validation, 10, null],
      [validation, 8, null],
      [validation, 0, [OUT_OF_RANGE_ERR]],
      [validation, 11, [OUT_OF_RANGE_ERR, NOT_EVEN_ERR]],
      [validation, 7, [NOT_EVEN_ERR]],
    ])
  })

  describe('omitting error messages (string shorthand)', () => {
    const validation = [
      '$switch',
      [
        [['$not', SYNC_INVALID_NUMBER_COND], 'INVALID_NUMBER_ERR'],
        [['$not', SYNC_OUT_OF_RANGE_COND], 'OUT_OF_RANGE_ERR'],
      ],
      null,
    ]

    testValidate([
      [validation, null, [{ code: 'INVALID_NUMBER_ERR' }]],
      [validation, undefined, [{ code: 'INVALID_NUMBER_ERR' }]],
      [validation, 10, null],
      [validation, 0, [{ code: 'OUT_OF_RANGE_ERR' }]],
      [validation, 11, [{ code: 'OUT_OF_RANGE_ERR' }]],
    ])
  })
})

describe('validateAsync(validation, value)', () => {
  const ASYNC_NOT_EVEN_COND = ['$eq', 0, ['$mathMod', ['$asyncEcho', 2]]]

  describe('sequential', () => {
    const validation = [
      '$switch',
      [
        [['$not', SYNC_INVALID_NUMBER_COND], 'INVALID_NUMBER_ERR'],
        [['$not', SYNC_OUT_OF_RANGE_COND], 'OUT_OF_RANGE_ERR'],
        [['$not', ASYNC_NOT_EVEN_COND], 'NOT_EVEN_ERR'],
      ],
      null,
    ]

    testValidate.async([
      [validation, 5, [{ code: 'NOT_EVEN_ERR' }]],
      [validation, 7, [{ code: 'NOT_EVEN_ERR' }]],
      [validation, null, [{ code: 'INVALID_NUMBER_ERR' }]],
      [validation, undefined, [{ code: 'INVALID_NUMBER_ERR' }]],
      [validation, 0, [{ code: 'OUT_OF_RANGE_ERR' }]],
      [validation, 11, [{ code: 'OUT_OF_RANGE_ERR' }]],
      [validation, 10, null],
      [validation, 4, null],
    ])
  })

  describe('parallel', () => {
    const validation = [
      '$pipe',
      [
        [
          '$arrayMap',
          [
            '$if',
            ['$evaluate', ['$value', '0'], ['$value', '$$PARENT_SCOPE']],
            null,
            ['$value', '1'],
          ],
          [
            [SYNC_INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
            [SYNC_OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
            [ASYNC_NOT_EVEN_COND, NOT_EVEN_ERR],
          ],
        ],
        ['$arrayFilter', ['$notEq', null]],
      ],
    ]

    testValidate.async([
      [validation, 10, null],
      [validation, 8, null],
      [validation, 0, [OUT_OF_RANGE_ERR]],
      [validation, 11, [OUT_OF_RANGE_ERR, NOT_EVEN_ERR]],
      [validation, 7, [NOT_EVEN_ERR]],
    ])
  })
})

describe('normalizeValidationResult(result)', () => {
  testCases(
    [
      [null, null],
      [[], null],
      ['ERROR_CODE', [{ code: 'ERROR_CODE' }]],
      [{ code: 'ERROR_CODE' }, [{ code: 'ERROR_CODE' }]],
      [
        [
          'ERROR_CODE',
          { code: 'ANOTHER_ERROR_CODE', message: 'Some error message' },
        ],
        [
          { code: 'ERROR_CODE' },
          { code: 'ANOTHER_ERROR_CODE', message: 'Some error message' },
        ],
      ],
    ],
    normalizeValidationResult
  )
})
