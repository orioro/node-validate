import {
  validate,
  ValidatorError,
  ValidationError
} from '../../'

const _resolveResults = (config, value, options, results) => {
  const errors = results.reduce((acc, result) => {
    // Flatten errors
    return result instanceof ValidationError ? [...acc, ...result.errors] : acc
  }, [])

  return errors.length > 0 ?
    [new ValidatorError('and', config, value), ...errors] : true
}

const _asyncAnd = (config, value, options) => {
  options = {
    ...options,
    onError: 'returnError'
  }

  return Promise.all(config.validations.map(validation => validate(options, validation, value)))
    .then(results => _resolveResults(config, value, options, results))
}

const _syncAnd = (config, value, options) => {
  options = {
    ...options,
    onError: 'returnError'
  }

  const results = config.validations.map(validation => validate(options, validation, value))

  return _resolveResults(config, value, options, results)
}

export const and = (config, value, options) => {
  return options.async ?
    _asyncAnd(config, value, options) :
    _syncAnd(config, value, options)
}
