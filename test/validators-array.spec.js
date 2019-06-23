import {
  ValidationError,
  validator,
  ARRAY_VALIDATORS,
  STRING_VALIDATORS,
} from '../src'

describe('array validators', () => {

  const validate = validator({
    validators: {
      ...ARRAY_VALIDATORS,
      ...STRING_VALIDATORS,
    },
    onError: 'returnError'
  })

  test('array', () => {
    const validation = {
      array: {
        message: 'Value must be an array'
      }
    }

    expect(validate(validation, [])).toEqual(true)
    expect(validate(validation, {})).toBeInstanceOf(ValidationError)
  })

  test('arrayMinLength', () => {
    const validation = {
      arrayMinLength: {
        length: 3,
      }
    }

    expect(validate(validation, [1, 2, 3])).toEqual(true)
    expect(validate(validation, [1, 2])).toBeInstanceOf(ValidationError)
  })

  test('arrayMaxLength', () => {
    const validation = {
      arrayMaxLength: {
        length: 3,
      }
    }

    expect(validate(validation, [1, 2, 3])).toEqual(true)
    expect(validate(validation, [1, 2, 3, 4])).toBeInstanceOf(ValidationError)
  })

  test('arrayExactLength', () => {
    const validation = {
      arrayExactLength: {
        length: 3,
      }
    }

    expect(validate(validation, [1, 2, 3])).toEqual(true)
    expect(validate(validation, [1, 2, 3, 4])).toBeInstanceOf(ValidationError)
    expect(validate(validation, [1, 2])).toBeInstanceOf(ValidationError)
  })

  test('arrayItems', () => {
    const validation = {
      arrayItems: {
        validation: {
          stringRegExp: {
            regExp: /^[0-9]+$/
          }
        }
      }
    }

    expect(validate(validation, ['123', '225', '4444'])).toEqual(true)
    expect(validate(validation, ['123', '225', 'not-a-digit'])).toBeInstanceOf(ValidationError)
  })

  test('arrayItems async - valid', () => {
    expect.assertions(1)

    const validate = validator({
      validators: {
        ...ARRAY_VALIDATORS,
        asyncAlwaysValid: () => {
          return new Promise(resolve => {
            setTimeout(resolve.bind(null, true), 100)
          })
        },
      },
      onError: 'returnError',
      async: true
    })

    return expect(validate({
      arrayItems: {
        message: 'Some invalid item in the array',
        validation: {
          asyncAlwaysValid: {}
        }
      }
    }, ['item-1', 'item-2'])).resolves.toEqual(true)
  })

  test('arrayItems async - invalid', () => {
    expect.assertions(5)

    const validate = validator({
      validators: {
        ...ARRAY_VALIDATORS,
        asyncAlwaysInvalid: () => {
          return new Promise(resolve => {
            setTimeout(resolve.bind(null, false), 100)
          })
        },
      },
      onError: 'returnError',
      async: true
    })

    return validate({
      arrayItems: {
        message: 'Some invalid item in the array',
        validation: {
          asyncAlwaysInvalid: {
            message: 'This validation is always invalid',
          }
        }
      }
    }, ['item-1', 'item-2'])
    .then(error => {
      expect(error).toBeInstanceOf(ValidationError)
      expect(error.errors).toHaveLength(3)
      expect(error.errors[0].message).toEqual('Some invalid item in the array')
      expect(error.errors[1].message).toEqual('This validation is always invalid')
      expect(error.errors[2].message).toEqual('This validation is always invalid')
    })
  })
})
