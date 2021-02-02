import { Expression } from '@orioro/expression'
import { ValidationCase } from './types'

/**
 * Takes an array of `ValidationCases` and returns a `ValidationExpression`
 * to be used with either `validate` or `validateThrow`.
 *
 * The returned expression evaluates each case sequentially
 * and if any of the cases returns a non-`null` value, the
 * validation is interrupted and remaining cases are not evaluated.
 * 
 * @function sequentialCases
 * @param {ValidationCase[]} cases
 * @returns {ValidationExpression}
 */
export const sequentialCases = (
  cases:ValidationCase[]
):Expression => ([
  '$switch',
  cases.map(([condition, error]) => ([
    ['$not', condition],
    error
  ])),
  null
])

/**
 * Takes an array of `ValidationCases` and returns a `ValidationExpression`
 * to be used with either `validate` or `validateThrow`.
 *
 * The returned expression evaluates all cases in parallel and
 * returns an array of all errors found.
 * 
 * @function parallelCases
 * @param {ValidationCase[]} cases
 * @returns {ValidationExpression}
 */
export const parallelCases = (
  cases:ValidationCase[]
):Expression => ([
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
      cases
    ],
    [
      '$arrayFilter',
      ['$notEq', null]
    ]
  ]
])

/**
 * Wraps the given `validationExpression` so that it returns
 * `null` (no error) if the value equals any of the specified
 * `allowedValues`.
 * 
 * @function allowValues
 * @param {*[]} allowedValues Values to be allowed
 * @param {ValidationExpression} validation Validation to be wrapped
 * @returns {ValidationExpression}
 */
export const allowValues = (
  allowedValues:any[],
  validation:Expression
):Expression => ([
  '$if',
  ['$in', allowedValues],
  null,
  validation
])
