import isPlainObject from 'lodash.isplainobject'
import mingo from 'mingo'
import validate from '../validate'
import {
  resolveNestedValidationResults
} from '../util'

export const object = ({}, value) => {
  return typeof value === 'object' && !Array.isArray(value)
}

export const objectPlain = ({}, value) => {
  return isPlainObject(value)
}

export const objectMatches = ({ query }, value) => {
  return object({}, value) && (new mingo.Query(query)).test(value)
}

const _objectPropertiesAsync = (config, value, options) => {
  const { properties } = config
  options = {
    ...options,
    onError: 'returnError'
  }

  return Promise.all(Object.keys(properties).map(propertyId => {
    return validate(
      options,
      config.properties[propertyId],
      value[propertyId]
    )
  }))
  .then(results => resolveNestedValidationResults('objectProperties', config, value, options, results))
}

const _objectPropertiesSync = (config, value, options) => {
  const { properties } = config
  options = {
    ...options,
    onError: 'returnError'
  }

  const results = Object.keys(properties).map(propertyId => {
    return validate(
      options,
      config.properties[propertyId],
      value[propertyId]
    )
  })

  return resolveNestedValidationResults('objectProperties', config, value, options, results)
}

export const objectProperties = (config, value, options) => {
  return options.async ?
    _objectPropertiesAsync(config, value, options) :
    _objectPropertiesSync(config, value, options)
}
