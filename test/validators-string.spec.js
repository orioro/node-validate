import {
  ValidationError,
  validator,
  STRING_VALIDATORS,
} from '../src'

describe('String validators', () => {
  const validate = validator({
    validators: {
      ...STRING_VALIDATORS
    },
    onError: 'returnError'
  })

  test('string', () => {
    const validation = {
      string: {
        _message: 'Value must be a string',
      }
    }

    expect(validate(validation, undefined)).toEqual(true)
    expect(validate(validation, null)).toEqual(true)
    expect(validate(validation, 'Some string')).toEqual(true)
    expect(validate(validation, 8)).toBeInstanceOf(ValidationError)
    expect(validate(validation, 8).errors[0].message).toEqual('Value must be a string')
  })

  test('stringMinLength', () => {
    const validation = {
      stringMinLength: {
        length: 8,
        _message: 'Password must be at least 8 chars long',
      }
    }

    expect(validate(validation, undefined)).toEqual(true)
    expect(validate(validation, null)).toEqual(true)
    expect(validate(validation, '12345678')).toEqual(true)
    expect(validate(validation, '123456789')).toEqual(true)
    expect(validate(validation, '1234567')).toBeInstanceOf(ValidationError)
    expect(validate(validation, '1234567').errors[0].message).toEqual('Password must be at least 8 chars long')
  })

  test('stringMaxLength', () => {
    const validation = {
      stringMaxLength: {
        length: 8,
        _message: 'Password must be at most 8 chars long',
      }
    }

    expect(validate(validation, undefined)).toEqual(true)
    expect(validate(validation, null)).toEqual(true)
    expect(validate(validation, '12345678')).toEqual(true)
    expect(validate(validation, '1234567')).toEqual(true)
    expect(validate(validation, '123456789')).toBeInstanceOf(ValidationError)
    expect(validate(validation, '123456789').errors[0].message).toEqual(validation.stringMaxLength._message)
  })

  test('stringRegExp', () => {
    const validation = {
      stringRegExp: {
        regExp: /^[0-9]+$/,
        _message: 'Digits only, at least one',
      }
    }

    expect(validate(validation, '123')).toEqual(true)
    expect(validate(validation, 123)).toBeInstanceOf(ValidationError)
    expect(validate(validation, '123A')).toBeInstanceOf(ValidationError)
    expect(validate(validation, '123.99')).toBeInstanceOf(ValidationError)
  })
})
