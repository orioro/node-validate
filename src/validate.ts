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

export type ValidateOptions = {
  interpreters: { [key: string]: ExpressionInterpreter },
}
const DEFAULT_VALIDATE_OPTIONS = {
  interpreters: ALL_EXPRESSIONS,
}

export const validate = (
  validationExpression:Expression,
  value:any,
  { interpreters }:ValidateOptions = DEFAULT_VALIDATE_OPTIONS
):(ValidationErrorSpec[] | null) => {
  const result = evaluate({
    interpreters,
    scope: { $$VALUE: value }
  }, validationExpression)

  return typeof result === 'string'
    ? [{ code: result }]
    : Array.isArray(result)
      ? result.length === 0
        ? null
        : result
      : result === null
        ? null
        : [result]
}

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

// export const validateCases = (
//   parallelCases:ValidationCase[],
//   value:any,
//   { interpreters }:ValidateOptions = DEFAULT_VALIDATE_OPTIONS
// ):ValidationErrorSpec[] => (
//   parallelCases.map(([condition, error]) => (
//     evaluate({
//       interpreters,
//       scope: { $$VALUE: value }
//     }, condition)
//       ? null
//       : typeof error === 'string'
//         ? { code: error }
//         : error
//   ))
//   .filter(result => result !== null) as ValidationErrorSpec[]
// )

// export const validateCasesThrow = (
//   parallelCases:ValidationCase[],
//   value:any,
//   options:ValidateOptions
// ):void => {
//   const errors = validateCases(parallelCases, value, options)

//   if (errors.length > 0) {
//     throw new ValidationError(errors, value)
//   }
// }
