import {
  ALL_EXPRESSIONS,
  Expression,
  ExpressionInterpreter,
  evaluate,
} from '@orioro/expression'
import { ValidationError } from './errors'

import {
  ValidationErrorSpec,
  ValidationCase
} from './types'

/**
 * Options for calling `validate`
 * 
 * @typedef {Object} ValidateOptions
 * @property {Object} options
 * @property {Object} options.interpreters Expression interpreters to be passed onto
 *                                         to @orioro/expression
 */
export type ValidateOptions = {
  interpreters: { [key: string]: ExpressionInterpreter },
}
const DEFAULT_VALIDATE_OPTIONS = {
  interpreters: ALL_EXPRESSIONS,
}

/**
 * Utility function that normalizes the validation result.
 * Takes as parameter the raw validation result output
 * (either `ValidationErrorSpec`, `string`, `null`) and returns
 * either `null` or a non-empty array of objects conforming to
 * `ValidationErrorSpec`.
 * 
 * @function normalizeValidationResult
 * @param {ValidationErrorSpec | string | null | (ValidationErrorSpec | string)[]} result
 * @returns {ValidationErrorSpec[] | null}
 */
export const normalizeValidationResult = (
  result:(
    ValidationErrorSpec |
    string |
    null |
    (ValidationErrorSpec | string)[]
  )
):(ValidationErrorSpec[] | null) => {
  return typeof result === 'string'
    ? [{ code: result }]
    : Array.isArray(result)
      ? result.length === 0
        ? null
        : result.map(r => (
            typeof r === 'string'
              ? { code: r }
              : r
          ))
      : result === null
        ? null
        : [result]
}

/**
 * Executes a validation expression against the given value.
 * Returns either an `Array` of `ValidationErrorSpec` objects
 * or `null` (which indicates there were no errors found and the
 * value is valid).
 *
 * The expression may return one of these values:
 * 
 * - a `string`: is interpreted as an error code and will be
 *   converted to a `ValidationErrorSpec` (e.g. `'SOME_VALIDATION_ERROR'`
 *   becomes `{ code: 'SOME_VALIDATION_ERROR' }`)
 * - an `object`: is interpreted as a `ValidationErrorSpec` and should
 *   have the properties `code` and `message`
 * - an `Array`: is interpreted as an array of `ValidationErrorSpec` objects
 * - `null`: indicates that no errors were found
 * 
 * @function validate
 * @param {Expression} validationExpression Expression to be evaluated by `@orioro/expression` module.
 * @param {*} value Value against which validation should be run
 * @param {ValidateOptions} [options] Optional options. May be used to supply custom set
 *                                    of expression `interpreters`.
 * @returns {null | ValidationErrorSpec[]}
 */
export const validate = (
  validationExpression:Expression,
  value:any,
  { interpreters }:ValidateOptions = DEFAULT_VALIDATE_OPTIONS
):(ValidationErrorSpec[] | null) => {
  const result = evaluate({
    interpreters,
    scope: { $$VALUE: value }
  }, validationExpression)

  return normalizeValidationResult(result)
}

/**
 * Performs same validation process as `validate` but if an error
 * is encountered throws a `ValidationError`.
 * 
 * @function validateThrow
 * @param {Expression} validationExpression
 * @param {*} value
 * @param {ValidateOptions} [options]
 * @throws {ValidationError} validationError
 */
export const validateThrow = (
  validationExpression:Expression,
  value:any,
  options:ValidateOptions = DEFAULT_VALIDATE_OPTIONS
):void => {
  const error = validate(validationExpression, value, options)

  if (error !== null) {
    throw new ValidationError([error], value)
  }
}
