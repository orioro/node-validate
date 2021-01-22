import { ValidationErrorSpec } from './types'

export class ValidationError extends Error {
  constructor(errors, value) {
    super(errors.map(error => (error.message || error.code)).join('; '))

    this.name = 'ValidationError'
    this.errors = errors
    this.value = value

    // // Make errors compatible with istanbul runtime
    // //
    // // a workaround to make `instanceof ValidationError` work in ES5
    // // https://github.com/facebook/jest/issues/6827#issuecomment-427952998
    // // https://github.com/babel/babel/issues/4485#issuecomment-315569892
    // this.constructor = ValidationError
    // this.__proto__ = ValidationError.prototype
  }

  errors:ValidationErrorSpec[]
  value:any

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      value: this.value,
      errors: this.errors
    }
  }
}
