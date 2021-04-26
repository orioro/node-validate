import { ALL_EXPRESSIONS } from '@orioro/expression'

import {
  sequentialCases,
  parallelCases,
  allowValues,
  prohibitValues,
} from './index'

import { _prepareTestFns } from '../spec/specUtil'
const testValidate = _prepareTestFns(ALL_EXPRESSIONS)

const INVALID_NUMBER_COND = ['$eq', 'number', ['$type']]
const INVALID_NUMBER_ERR = {
  code: 'INVALID_NUMBER_ERR',
  message: 'Must be a number',
}

const OUT_OF_RANGE_COND = [
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

const NOT_EVEN_COND = ['$eq', 0, ['$mathMod', 2]]
const NOT_EVEN_ERR = {
  code: 'NOT_EVEN_ERR',
  message: 'Must be an even number',
}

describe('sequentialCases(cases)', () => {
  describe('basic', () => {
    const validation = sequentialCases([
      [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
      [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
      [NOT_EVEN_COND, NOT_EVEN_ERR],
    ])

    testValidate([
      [validation, null, [INVALID_NUMBER_ERR]],
      [validation, undefined, [INVALID_NUMBER_ERR]],
      [validation, 10, null],
      [validation, 0, [OUT_OF_RANGE_ERR]],
      [validation, 11, [OUT_OF_RANGE_ERR]],
    ])
  })

  describe('empty cases (should always return valid)', () => {
    const validation = sequentialCases([])
    testValidate([
      [validation, null, null],
      [validation, undefined, null],
      [validation, 10, null],
      [validation, 0, null],
      [validation, 11, null],
    ])
  })
})

describe('parallelCases(cases)', () => {
  describe('basic - sync', () => {
    const validation = parallelCases([
      [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
      [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
      [NOT_EVEN_COND, NOT_EVEN_ERR],
    ])

    testValidate([
      [validation, null, TypeError],
      [validation, undefined, TypeError],
      [validation, 10, null],
      [validation, 0, [OUT_OF_RANGE_ERR]],
      [validation, 11, [OUT_OF_RANGE_ERR, NOT_EVEN_ERR]],
    ])
  })

  describe('empty cases (should always return valid)', () => {
    const validation = parallelCases([])

    testValidate([
      [validation, null, null],
      [validation, undefined, null],
      [validation, 10, null],
      [validation, 0, null],
      [validation, 11, null],
    ])
  })
})

describe('allowValues', () => {
  describe('null', () => {
    const validation = allowValues(
      [null],
      parallelCases([
        [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
        [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
        [NOT_EVEN_COND, NOT_EVEN_ERR],
      ])
    )

    testValidate([
      [validation, null, null],
      [validation, undefined, TypeError],
      [validation, 10, null],
      [validation, 0, [OUT_OF_RANGE_ERR]],
      [validation, 11, [OUT_OF_RANGE_ERR, NOT_EVEN_ERR]],
    ])
  })

  describe('undefined', () => {
    const validation = allowValues(
      [undefined],
      parallelCases([
        [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
        [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
        [NOT_EVEN_COND, NOT_EVEN_ERR],
      ])
    )

    testValidate([
      [validation, null, TypeError],
      [validation, undefined, null],
      [validation, 10, null],
      [validation, 0, [OUT_OF_RANGE_ERR]],
      [validation, 11, [OUT_OF_RANGE_ERR, NOT_EVEN_ERR]],
    ])
  })

  describe('null and undefined', () => {
    const validation = allowValues(
      [null, undefined],
      parallelCases([
        [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
        [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
        [NOT_EVEN_COND, NOT_EVEN_ERR],
      ])
    )

    testValidate([
      [validation, null, null],
      [validation, undefined, null],
      [validation, 10, null],
      [validation, 0, [OUT_OF_RANGE_ERR]],
      [validation, 11, [OUT_OF_RANGE_ERR, NOT_EVEN_ERR]],
    ])
  })
})

describe('prohibitValues(values, error, validation)', () => {
  const validation = prohibitValues(
    [undefined, null],
    'REQUIRED_ERROR',
    parallelCases([
      [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
      [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
      [NOT_EVEN_COND, NOT_EVEN_ERR],
    ])
  )

  testValidate([
    [validation, null, [{ code: 'REQUIRED_ERROR' }]],
    [validation, undefined, [{ code: 'REQUIRED_ERROR' }]],
    [validation, 10, null],
    [validation, 0, [OUT_OF_RANGE_ERR]],
    [validation, 11, [OUT_OF_RANGE_ERR, NOT_EVEN_ERR]],
  ])
})
