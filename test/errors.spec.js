import {
  ValidatorError,
  ValidationError
} from '../src'

describe('ValidationError', () => {
  test('basic', () => {
    const error = new ValidationError(10, [
      new Error('Some error'),
      new Error('Some other error')
    ])

    expect(error.name).toEqual('ValidationError')
    expect(error.message).toEqual('Invalid value: \'10\'. Error messages: Some error, Some other error')
    expect(error.errors).toHaveLength(2)
    expect(error.value).toEqual(10)
    expect(error.errors[0].message).toEqual('Some error')
    expect(error.errors[1].message).toEqual('Some other error')
  })

  test('toJSON', () => {
    const error = new ValidationError(10, [
      new Error('Some error'),
      new Error('Some other error')
    ])

    //
    // Expect stringification to export only allowed properties
    //
    expect(JSON.parse(JSON.stringify(error))).toEqual({
      name: 'ValidationError',
      value: 10,
      message: 'Invalid value: \'10\'. Error messages: Some error, Some other error',
      errors: [{}, {}],
    })
  })
})

describe('ValidatorError', () => {
  test('basic', () => {
    const message = ({ value, config1, config2 }) => {
      return `${value} is invalid, should match criteria: ${config1}, ${config2}`
    }

    const config = {
      config1: true,
      config2: 70,
      message: message
    }
    const value = 'Some value'

    const error = new ValidatorError('someValidatorId', config, value)

    expect(error.name).toEqual('ValidatorError')
    expect(error.message).toEqual(message({...config, value}))
    expect(error.value).toEqual(value)
    expect(error.validatorId).toEqual('someValidatorId')
  })

  test('toJSON', () => {
    const message = ({ value, config1, config2 }) => {
      return `${value} is invalid, should match criteria: ${config1}, ${config2}`
    }

    const config = {
      config1: true,
      config2: 70,
      message: message
    }
    const value = 'Some value'

    const error = new ValidatorError('someValidatorId', config, value)

    expect(JSON.parse(JSON.stringify(error.toJSON()))).toEqual({
      message: message({...config, value}),
      name: 'ValidatorError',
      value,
    })
  })
})
