import curry from 'lodash.curry'
import validate from './validate'

export const validator = curry(validate)

export {
  validate
}

export * from './errors'
export * from './validators'
