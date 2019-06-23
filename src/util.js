import {
  ValidationError,
  ValidatorError
} from './errors'

export const resolveNestedValidationResults = (validationId, config, value, options, results) => {
  const errors = results.reduce((acc, result) => {
    // Flatten errors
    return result instanceof ValidationError ? [...acc, ...result.errors] : acc
  }, [])

  return errors.length > 0 ?
    [new ValidatorError(validationId, config, value), ...errors] : true
}
