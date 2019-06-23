import validate from '../validate'
import {
  resolveNestedValidationResults
} from '../util'

export const array = ({}, value) => {
  return Array.isArray(value)
}

export const arrayMinLength = ({ length }, value) => {
  return array({}, value) && value.length >= length
}

export const arrayMaxLength = ({ length }, value) => {
  return array({}, value) && value.length <= length
}

export const arrayExactLength = ({ length }, value) => {
  return array({}, value) && value.length === length
}

const _arrayItemsAsync = (config, value, options) => {
  options = {
    ...options,
    onError: 'returnError'
  }

  return Promise.all(value.map(item => validate(options, config.validation, item)))
    .then(results => resolveNestedValidationResults('arrayItems', config, value, options, results))
}

const _arrayItemsSync = (config, value, options) => {
  options = {
    ...options,
    onError: 'returnError'
  }

  const results = value.map(item => validate(options, config.validation, item))

  return resolveNestedValidationResults('arrayItems', config, value, options, results)
}

export const arrayItems = (config, value, options) => {
  return array({}, value) && options.async ?
    array({}, value) && _arrayItemsAsync(config, value, options) :
    array({}, value) && _arrayItemsSync(config, value, options)
}
