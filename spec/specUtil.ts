import { interpreterList } from '@orioro/expression'
import { prepareValidate } from '../src/'

import {
  testCases,
  asyncResult,
  variableName,
  fnCallLabel,
} from '@orioro/jest-util'

export const _validateCallLabel = (fnName) => ([, input], result) =>
  fnCallLabel(fnName, [variableName('validation'), input], result)

export const _asyncCases = (cases) =>
  cases.map((_case) => [
    ..._case.slice(0, _case.length - 1),
    asyncResult(_case[_case.length - 1]),
  ])

export const _prepareTestFns = (expressionInterpreters) => {
  const { validateSync, validateAsync } = prepareValidate({
    interpreters: interpreterList(expressionInterpreters),
  })

  const testSyncValidations = (cases) => {
    testCases(cases, validateSync, _validateCallLabel('validateSync'))
  }

  const testAsyncValidations = (cases) => {
    testCases(
      _asyncCases(cases),
      validateAsync,
      _validateCallLabel('validateAsync')
    )
  }

  const testAll = (cases) => {
    describe('sync', testSyncValidations.bind(null, cases))
    describe('async', testAsyncValidations.bind(null, cases))
  }

  Object.assign(testAll, {
    validateSync,
    validateAsync,
    sync: testSyncValidations,
    async: testAsyncValidations,
  })

  return testAll
}
