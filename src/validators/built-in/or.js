import {
  validate,
  ValidatorError,
  ValidationError
} from '../../'

const _resolveResults = (config, value, options, results) => {
  let errors = []
  const orResult = results.some(result => {
    if (result instanceof ValidationError) {
      errors = [...errors, ...result.errors]
      return false
    } else {
      return true
    }
  })

  return orResult ?
    true :
    [new ValidatorError('or', config, value), ...errors]
}

const _asyncOr = (config, value, options) => {
  options = {
    ...options,
    onError: 'returnError'
  }

  return Promise.all(config.validations.map(validation => validate(options, validation, value)))
    .then(results => _resolveResults(config, value, options, results))
}

const _syncOr = (config, value, options) => {
  options = {
    ...options,
    onError: 'returnError'
  }

  const results = config.validations.map(validation => validate(options, validation, value))

  return _resolveResults(config, value, options, results)
}

export const or = (config, value, options) => {
  return options.async ?
    _asyncOr(config, value, options) :
    _syncOr(config, value, options)
}
