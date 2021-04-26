import { interpreterList, ALL_EXPRESSIONS } from '@orioro/expression'

import {
  parallelCases,
  sequentialCases,
  ValidationError,
  prepareValidate,
} from './index'

import { _validateCallLabel, _asyncCases } from '../spec/specUtil'

import { testCases } from '@orioro/jest-util'

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

const { validateSyncThrow, validateAsyncThrow } = prepareValidate({
  interpreters: interpreterList({
    ...ALL_EXPRESSIONS,
    $asyncEcho: {
      sync: null,
      async: (context, value) =>
        new Promise((resolve) => setTimeout(() => resolve(value), 50)),
    },
  }),
})

describe('validate[Sync/Async]Throw(validation, value, options)', () => {
  describe('parallelCases', () => {
    const validation = parallelCases([
      [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
      [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
      [NOT_EVEN_COND, NOT_EVEN_ERR],
    ])

    const expectations = [
      [validation, null, TypeError],
      [validation, undefined, TypeError],
      [validation, 10, undefined],
      [validation, 8, undefined],
      [validation, 0, ValidationError],
      [validation, 11, ValidationError],
      [validation, 7, ValidationError],
    ]

    describe('sync', () =>
      testCases(
        expectations,
        validateSyncThrow,
        _validateCallLabel('validateSyncThrow')
      ))

    describe('async', () =>
      testCases(
        _asyncCases(expectations),
        validateAsyncThrow,
        _validateCallLabel('validateAsyncThrow')
      ))
  })

  describe('sequentialCases', () => {
    const validation = sequentialCases([
      [INVALID_NUMBER_COND, INVALID_NUMBER_ERR],
      [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
      [NOT_EVEN_COND, NOT_EVEN_ERR],
    ])

    const expectations = [
      [validation, null, ValidationError],
      [validation, undefined, ValidationError],
      [validation, 10, undefined],
      [validation, 8, undefined],
      [validation, 0, ValidationError],
      [validation, 11, ValidationError],
      [validation, 7, ValidationError],
    ]

    describe('sync', () =>
      testCases(
        expectations,
        validateSyncThrow,
        _validateCallLabel('validateSyncThrow')
      ))

    describe('async', () =>
      testCases(
        _asyncCases(expectations),
        validateAsyncThrow,
        _validateCallLabel('validateAsyncThrow')
      ))
  })
})

describe('new ValidationError(errors, value) constructor', () => {
  test('errors', () => {
    const errorSpecs = [
      { code: 'ERR_CODE_1', message: 'Some error 1' },
      { code: 'ERR_CODE_2', message: 'Some error 2' },
      { code: 'ERR_CODE_3' },
    ]
    const error = new ValidationError(errorSpecs, 'some-value')

    expect(error.code).toEqual('ERR_VALIDATION')
    expect(error.name).toEqual('ValidationError')
    expect(error.errors).toEqual(errorSpecs)

    expect(error.toJSON()).toEqual({
      code: 'ERR_VALIDATION',
      name: 'ValidationError',
      message: error.message,
      value: 'some-value',
      errors: errorSpecs,
    })
  })
})
