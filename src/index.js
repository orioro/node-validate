import {applyMatchingReduce} from '@orioro/util/fn'
import curry from 'lodash.curry'

import {
  notNull,
  notUndefined,
  and,
  or,
} from './validators/built-in'

import {
  ValidatorError,
  ValidationError
} from './errors'

const _getValidator = (validators, validatorId) => {
  const validator = validators[validatorId]

  if (typeof validator !== 'function') {
    throw new Error(`Validator \`${validatorId}\` is not defined`)
  }

  return validator
}

/**
 * Takes in the result and converts it into correct error format
 */
const _resolveSingleValidatorResult = (validatorId, config, value, result) => {
  const { _negative = false } = config

  if (result === false || result === undefined) {
    // Validator failed (and returned falsy value)
    return _negative ? [] : [new ValidatorError(validatorId, config, value)]
  } else if (result instanceof Error) {
    // Validator failed (and returned a single error)
    result.validatorId = validatorId
    return _negative ? [] : [result]
  } else if (Array.isArray(result)) {
    // Validator failed (and returned a list of errors)
    return _negative ? [] : result
  } else {
    // Validator returned no errors
    return _negative ? [new ValidatorError(validatorId, config, value)] : []
  }
}

const _catchError = fn => {
  let result = false

  try {
    result = fn()
  } catch (err) {
    result = err
  }

  return result
}

/**
 * Applies a single validator and returns an array of results.
 * The validator function may return either of:
 * - Boolean
 * - Error
 * - Array[Boolean,Error]
 *
 * Or throw an error
 */
const _syncApplySingleValidator = (options, validatorId, config, value) => {
  const validator = _getValidator(options.validators, validatorId)

  const result = _catchError(validator.bind(null, config, value, options))

  return _resolveSingleValidatorResult(validatorId, config, value, result)
}

const _asyncApplySingleValidator = (options, validatorId, config, value) => {
  //
  // Keep the _getValidator call outside the promise chain
  // so that configuration issues do not pollute the validation process
  //
  const validator = _getValidator(options.validators, validatorId)

  return new Promise(resolve => resolve(validator(config, value, options)))
    .then(
      result => _resolveSingleValidatorResult(validatorId, config, value, result),
      err => _resolveSingleValidatorResult(validatorId, config, value, err)
    )
}

/**
 * Applies core validators:
 * - notUndefined
 * - notNull
 *
 * If all core validators pass, call the function that will proceed
 * validation with the remaining validations
 */
const _applyCoreValidators = ({
  notUndefined,
  notNull,
  ...remainingValidation
}, value, otherwise) => {
  switch (value) {
    case undefined:
      return notUndefined ?
        [new ValidatorError('notUndefined', notUndefined)] : []
    case null:
      return notNull ?
        [new ValidatorError('notNull', notNull)] : []
    default:
      return otherwise(Object.keys(remainingValidation))
  }
}

/**
 * Adds builtin validators to the validators map
 */
const _addBuiltInValidators = validators => {
  return Object.assign({
    and,
    or
  }, validators)
}

const _asyncValidate = (options, validation, value) => {
  options.validators = _addBuiltInValidators(options.validators)

  return Promise.resolve(_applyCoreValidators(
    validation,
    value,
    remainingValidatorIds => {
      return Promise.all(remainingValidatorIds.map(validatorId => {
        return _asyncApplySingleValidator(
          options,
          validatorId,
          validation[validatorId],
          value
        )
      }))
      .then(results => results.reduce((acc, res) => {
        return [...acc, ...res]
      }, []))
    }
  ))
  .then(_resolveValidationResults.bind(null, options, validation, value))
}

const _syncValidate = (options, validation, value) => {
  options.validators = _addBuiltInValidators(options.validators)

  const results = _applyCoreValidators(
    validation,
    value,
    remainingValidatorIds => {
      return remainingValidatorIds.reduce((acc, validatorId) => {
        return [...acc, ..._syncApplySingleValidator(
          options,
          validatorId,
          validation[validatorId],
          value
        )]
      }, [])
    }
  )

  return _resolveValidationResults(options, validation, value, results)
}

/**
 * Resolves the results of the overall validation
 * for both sync and async versions
 */
const _resolveValidationResults = (options, validation, value, results) => {
  const errors = results.filter(result => result instanceof Error)

  if (errors.length > 0) {
    const err = new ValidationError(value, errors)

    switch (options.onError) {
      case 'returnError':
        return err
      case 'returnFalse':
        return false
      case 'throw':
      default:
        throw err
    }
  } else {
    return true
  }
}

export const validate = (options, validation, value) => {
  return options.async ?
    _asyncValidate(options, validation, value) :
    _syncValidate(options, validation, value)
}

export const validator = curry(validate)

export * from './validators/number'
export * from './errors'
