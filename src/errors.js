import isPlainObject from 'lodash.isplainobject'

const _getValidatorErrorMessage = (validatorId, config, value) => {
  switch (typeof config._message) {
    case 'function':
      return config._message({
        ...config,
        validatorId,
        value
      })
    case 'string':
      return config._message
    default:
      return `Validation \`${validatorId}\` failed.`
  }
}

/**
 * Constructor for errors that happen at a single validator
 */
export class ValidatorError extends Error {
  constructor(validatorId, config, value) {
    super(_getValidatorErrorMessage(validatorId, config, value))

    this.name = 'ValidatorError'
    this.validatorId = validatorId
    this.value = value

    // Make errors compatible with istanbul runtime
    //
    // a workaround to make `instanceof ValidatorError` work in ES5
    // https://github.com/facebook/jest/issues/6827#issuecomment-427952998
    // https://github.com/babel/babel/issues/4485#issuecomment-315569892
    this.constructor = ValidatorError
    this.__proto__ = ValidatorError.prototype
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      value: this.value,
    }
  }
}

/**
 * Constructor for errors at validation level
 */
export class ValidationError extends Error {
  constructor(value, errors) {
    const errorMessages = errors.map(err => err.message).join(', ')

    value = isPlainObject(value) || Array.isArray(value) ?
      JSON.stringify(value) : value

    super(`Invalid value: '${value}'. Error messages: ${errorMessages}`)

    this.name = 'ValidationError'
    this.errors = errors
    this.value = value

    // Make errors compatible with istanbul runtime
    //
    // a workaround to make `instanceof ValidationError` work in ES5
    // https://github.com/facebook/jest/issues/6827#issuecomment-427952998
    // https://github.com/babel/babel/issues/4485#issuecomment-315569892
    this.constructor = ValidationError
    this.__proto__ = ValidationError.prototype
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      errors: this.errors,
      value: this.value,
    }
  }
}
