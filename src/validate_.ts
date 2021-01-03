import {
  BooleanExpression,
  evaluateBoolean,
  evaluateString,

  evaluate,
  ALL_EXPRESSIONS
} from '@orioro/expression'
import { cascadeFilter, cascadeFind } from '@orioro/cascade'
import { ValidationError } from './errors'






const VALIDATION = [
  '$if',
  null,
  ['$switch', [
    [['$not', ['$eq', 'number', ['$type']]], {
      code: 'INVALID_NUMBER',
      message: 'Must be a number'
    }],
    [['$not', ['$and', [
      ['$gte', 1],
      ['$lte', 10]
    ]]], {
      code: 'OUT_OF_RANGE',
      message: 'Must be a number between 1 and 10'
    }],
  ], null],
  ['$eq', null]
]

console.log(evaluate({
  interpreters: ALL_EXPRESSIONS,
  data: {
    $$VALUE: 9
  }
}, VALIDATION))










export type ValidationErrorSpec = {
  code: string,
  message: string
}
export type Validation = [BooleanExpression, ValidationErrorSpec]
export type ValidateOptions = {
  interpreters: {
    [key: string]: () => any
  }
}

const _isInvalid = (interpreters, exp, value) => !evaluateBoolean({
  interpreters,
  data: {
    $$VALUE: value
  }
}, exp)

const _checkValidations = (validations:Validation[]) => {
  if (!Array.isArray(validations) && validations.length === 0) {
    throw new Error(`Invalid validations ${JSON.stringify(validations)}`)
  }

  validations.forEach(validation => {
    if (!Array.isArray(validation) || validation.length !== 2) {
      throw new Error(`Invalid validation ${JSON.stringify(validation)}`)
    }
  })
}

export const validate = (
  options:ValidateOptions,
  validations:Validation[],
  value:any
):(ValidationErrorSpec[] | null) => {
  const error = cascadeFind(
    _isInvalid.bind(null, options.interpreters),
    validations,
    value
  )

  return error
    ? {
        ...error,
        message: evaluateString(options.interpreters, error.message)
      }
    : null
}

export const validateAll = (
  options:ValidateOptions,
  validations:Validation[],
  value:any
):(ValidationErrorSpec[] | null) => {
  const errors = cascadeFilter(
    _isInvalid.bind(null, options.interpreters),
    validations,
    value
  )

  return errors.length > 0
    ? errors.map((error) => ({
        ...error,
        message: evaluateString(options.interpreters, error.message)
      }))
    : null
}

export const validateThrow = (
  options:ValidateOptions,
  validations:Validation[],
  value:any
) => {
  const error = validate(options, validations, value)

  if (error !== null) {
    throw new ValidationError([error], value)
  }
}

export const validateAllThrow = (
  options:ValidateOptions,
  validations:Validation[],
  value:any
) => {
  const errors = validateAll(options, validations, value)

  if (errors !== null) {
    throw new ValidationError(errors, value)
  }
}
