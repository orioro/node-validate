const {
  ValidationError,
  validator,
} = require('../src')

describe('validate (sync)', () => {
  const validate = validator({
    validators: {
      isEven: ({}, value) => {
        return value % 2 === 0
      },
      throwError: ({}, value) => {
        throw new Error('Test thrown error')
      },
      returnError: ({}, value) => {
        return new Error('Test returned error')
      },
      returnFalse: ({}, value) => {
        return false
      }
    },
    onError: 'returnError'
  })

  test('basic', () => {
    expect(validate({
      isEven: {}
    }, 10)).toEqual(true)

    const err = validate({
      isEven: { _message: 'Value must be even!' }
    }, 11)

    expect(err).toBeInstanceOf(ValidationError)
    expect(err.errors).toHaveLength(1)
    expect(err.errors[0].validatorId).toEqual('isEven')
    expect(err.errors[0].message).toEqual('Value must be even!')
  })

  test('message function', () => {
    const err = validate({
      isEven: { _message: ({ value }) => `${value} is not even` }
    }, 11)

    expect(err).toBeInstanceOf(ValidationError)
    expect(err.errors).toHaveLength(1)
    expect(err.errors[0].validatorId).toEqual('isEven')
    expect(err.errors[0].message).toEqual('11 is not even')
  })

  test('throwError', () => {
    const err = validate({
      throwError: {}
    }, 'any-value')

    expect(err).toBeInstanceOf(ValidationError)
    expect(err.errors).toHaveLength(1)
    expect(err.errors[0].validatorId).toEqual('throwError')
    expect(err.errors[0].message).toEqual('Test thrown error')
  })

  test('returnError', () => {
    const err = validate({
      returnError: {}
    }, 'any-value')

    expect(err).toBeInstanceOf(ValidationError)
    expect(err.errors).toHaveLength(1)
    expect(err.errors[0].validatorId).toEqual('returnError')
    expect(err.errors[0].message).toEqual('Test returned error')
  })

  test('returnFalse', () => {
    const err = validate({
      returnFalse: {}
    }, 'any-value')

    expect(err).toBeInstanceOf(ValidationError)
    expect(err.errors).toHaveLength(1)
    expect(err.errors[0].validatorId).toEqual('returnFalse')
  })

  test('negative throwError', () => {
    expect(validate({
      throwError: {
        _negative: true,
      }
    }, 'any-value')).toEqual(true)
  })

  test('negative returnError', () => {
    expect(validate({
      returnError: {
        _negative: true,
      }
    }, 'any-value')).toEqual(true)
  })

  test('negative returnFalse', () => {
    expect(validate({
      returnFalse: {
        _negative: true,
      }
    }, 'any-value')).toEqual(true)
  })

  describe('onError: returnError, returnFalse, throw', () => {
    const VALIDATOR_OPTIONS = {
      validators: {
        alwaysFail: () => false,
      }
    }

    test('returnError', () => {
      const validate = validator({
        ...VALIDATOR_OPTIONS,
        onError: 'returnError'
      })

      const err = validate({
        alwaysFail: {
          _message: 'Some error message'
        }
      }, 'some-value')

      expect(err).toBeInstanceOf(ValidationError)
      expect(err.errors).toHaveLength(1)
      expect(err.errors[0].message).toEqual('Some error message')
    })

    test('returnFalse', () => {
      const validate = validator({
        ...VALIDATOR_OPTIONS,
        onError: 'returnFalse'
      })

      expect(validate({
        alwaysFail: {
          _message: 'Some error message'
        }
      }, 'some-value')).toEqual(false)
    })

    test('throw', () => {
      const validate = validator({
        ...VALIDATOR_OPTIONS,
        onError: 'throw'
      })

      expect(() => {
        validate({
          alwaysFail: {
            _message: 'Some error message'
          }
        }, 'some-value')
      }).toThrow(/Invalid value: 'some-value'/)
    })
  })
})
