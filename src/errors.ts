import { ValidationErrorSpec } from './types'

export const ERR_VALIDATION = 'ERR_VALIDATION'

/**
 * @typedef {Error} ValidationError
 * @property {Error} validationError
 * @property {string} validationError.name
 * @property {string} validationError.message
 * @property {ValidationErrorSpec[]} validationError.errors
 * @property {*} validationError.value
 */
export class ValidationError extends Error {
  constructor(
    errors: ValidationErrorSpec[],
    value: any // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
  ) {
    super(errors.map((error) => error.message || error.code).join('; '))

    this.code = ERR_VALIDATION
    this.name = 'ValidationError'
    this.errors = errors
    this.value = value
  }

  code: 'ERR_VALIDATION'
  errors: ValidationErrorSpec[]
  value: any

  toJSON(): {
    code: string
    name: string
    message: string
    value: any
    errors: ValidationErrorSpec[]
  } {
    return {
      code: ERR_VALIDATION,
      name: this.name,
      message: this.message,
      value: this.value,
      errors: this.errors,
    }
  }
}
