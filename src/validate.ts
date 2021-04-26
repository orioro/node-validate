import {
  ALL_EXPRESSIONS,
  Expression,
  InterpreterList,
  evaluateSync,
  evaluateAsync,
  interpreterList,
} from '@orioro/expression'
import { ValidationError } from './errors'

import { ValidationErrorSpec } from './types'

/**
 * Options for calling `validateSync`
 *
 * @typedef {Object} ValidateOptions
 * @property {Object} options
 * @property {Object} options.interpreters Expression interpreters to be passed onto
 *                                         to @orioro/expression
 */
export type ValidateOptions = {
  interpreters: InterpreterList
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
  result: ValidationErrorSpec | string | null | (ValidationErrorSpec | string)[]
): ValidationErrorSpec[] | null => {
  return typeof result === 'string'
    ? [{ code: result }]
    : Array.isArray(result)
    ? result.length === 0
      ? null
      : result.map((r) => (typeof r === 'string' ? { code: r } : r))
    : result === null
    ? null
    : [result]
}

/**
 * @function prepareValidate
 * @param {ValidateOptions} [options] Optional options. May be used to supply custom set
 *                                    of expression `interpreters`.
 * @returns {{ validateSync, validateAsync, validateSyncThrow, validateAsyncThrow }}
 */
export const prepareValidate = ({
  interpreters,
}: ValidateOptions): {
  validateSync: (
    validationExpression: Expression,
    value: any
    // value: any // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
  ) => ValidationErrorSpec[] | null
  validateAsync: (
    validationExpression: Expression,
    value: any
  ) => Promise<ValidationErrorSpec[] | null>
  validateSyncThrow: (validationExpression: Expression, value: any) => void
  validateAsyncThrow: (
    validationExpression: Expression,
    value: any
  ) => Promise<void>
} => {
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
   * @function validateSync
   * @param {Expression} validationExpression Expression to be evaluated by `@orioro/expression` module.
   * @param {*} value Value against which validation should be run
   * @returns {null | ValidationErrorSpec[]}
   */
  const validateSync = (validationExpression, value) => {
    const result = evaluateSync(
      {
        interpreters,
        scope: { $$VALUE: value },
      },
      validationExpression
    )

    return normalizeValidationResult(result)
  }

  /**
   * @function validateAsync
   * @param {Expression} validationExpression
   * @param {*} value
   * @returns {Promise<null | ValidationErrorSpec[]>}
   */
  const validateAsync = (validationExpression, value) => {
    return evaluateAsync(
      {
        interpreters,
        scope: { $$VALUE: value },
      },
      validationExpression
    ).then((result) => normalizeValidationResult(result))
  }

  /**
   * Performs same validation process as `validateSync` but if an error
   * is encountered throws a `ValidationError`.
   *
   * @function validateSyncThrow
   * @param {Expression} validationExpression
   * @param {*} value
   * @throws {ValidationError} validationError
   */
  const validateSyncThrow = (validationExpression, value) => {
    const errors = validateSync(validationExpression, value)

    if (errors !== null) {
      throw new ValidationError(errors, value)
    }
  }

  /**
   * @function validateAsyncThrow
   * @param {Expression} validationExpression
   * @param {*} value
   * @throws {ValidationError} validationError
   */
  const validateAsyncThrow = (validationExpression, value) =>
    validateAsync(validationExpression, value).then((errors) => {
      if (errors !== null) {
        throw new ValidationError(errors, value)
      }
    })

  return {
    validateSync,
    validateSyncThrow,
    validateAsync,
    validateAsyncThrow,
  }
}

const {
  validateSync,
  validateAsync,
  validateSyncThrow,
  validateAsyncThrow,
} = prepareValidate({
  interpreters: interpreterList(ALL_EXPRESSIONS),
})

export { validateSync, validateAsync, validateSyncThrow, validateAsyncThrow }
