import { evaluateBoolean, BooleanExpression } from '@orioro/expression'
import { cascadeFilter, cascadeFind } from '@orioro/cascade'

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
):(ValidationErrorSpec[] | null) => (
  cascadeFind(
    _isInvalid.bind(null, options.interpreters),
    validations,
    value
  ) || null
)

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
    ? errors.map(({ code, message }) => ({
        code,
        message: typeof message === 'function'
          ? message(value)
          : message
      }))
    : null
}
