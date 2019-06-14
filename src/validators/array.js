import validate from '../validate'
import {
  ValidationError,
  ValidatorError
} from '../errors'

export const array = ({}, value) => {
  return Array.isArray(value)
}

export const arrayMinLength = ({ length }, value) => {
  return array({}, value) && value.length >= length
}

export const arrayMaxLength = ({ length }, value) => {
  return array({}, value) && value.length <= length
}

const _arrayItemResolveResults = (config, value, options, results) => {
  const errors = results.reduce((acc, result) => {
    // Flatten errors
    return result instanceof ValidationError ? [...acc, ...result.errors] : acc
  }, [])

  return errors.length > 0 ?
    [new ValidatorError('arrayItem', config, value), ...errors] : true
}

const _arrayItemAsync = (config, value, options) => {
  options = {
    ...options,
    onError: 'returnError'
  }

  return Promise.all(value.map(item => validate(options, config.validation, item)))
    .then(results => _arrayItemResolveResults(config, value, options, results))
}

const _arrayItemSync = (config, value, options) => {
  options = {
    ...options,
    onError: 'returnError'
  }

  const results = value.map(item => validate(options, config.validation, item))

  return _arrayItemResolveResults(config, value, options, results)
}

export const arrayItem = (config, value, options) => {
  return options.async ?
    array({}, value) && _arrayItemAsync(config, value, options) :
    array({}, value) && _arrayItemSync(config, value, options)
}
