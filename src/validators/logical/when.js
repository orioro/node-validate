import mingo from 'mingo'
import isPlainObject from 'lodash.isplainobject'
import { resolveNestedValidationResults } from '../../util'
import validate from '../../validate'

const _testCriteria = (criteria, value) => {
  return isPlainObject(value) ?
    (new mingo.Query(criteria)).test(value) :
    (new mingo.Query({ value: criteria })).test({ value })
}

const _asyncWhen = (config, value, options) => {
  const { cases } = config

  const _options = {
    ...options,
    onError: 'returnError'
  }

  return Promise.all(cases.map(_case => {
    return _testCriteria(_case.criteria, value) ?
      validate(_options, _case.validation, value) :
      true
  }))
  .then(results => {
    return resolveNestedValidationResults('when', config, value, options, results)
  })
}

const _syncWhen = (config, value, options) => {
  const { cases } = config

  const _options = {
    ...options,
    onError: 'returnError'
  }

  const results = cases.map(_case => {
    return _testCriteria(_case.criteria, value) ?
      validate(_options, _case.validation, value) :
      true
  })

  return resolveNestedValidationResults('when', config, value, options, results)
}

export const when = (config, value, options) => {
  return options.async ?
    _asyncWhen(config, value, options) :
    _syncWhen(config, value, options)
}
