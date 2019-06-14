import {
  ValidationError,
  validator,
  EQUALITY_VALIDATORS,
} from '../src'

describe('Boolean validators', () => {
  const validate = validator({
    validators: {
      ...EQUALITY_VALIDATORS
    },
    onError: 'returnFalse'
  })

  test('identity', () => {

    const a = {
      key: 'value'
    }

    const b = {
      key: 'value'
    }

    const validation = {
      identity: {
        _message: 'Value must be a identity',
        value: a,
      }
    }

    expect(validate(validation, undefined)).toEqual(true)
    expect(validate(validation, null)).toEqual(true)
    expect(validate(validation, a)).toEqual(true)
    expect(validate(validation, b)).toEqual(false)
  })

  test('deepEqual', () => {
    const a = {
      key: 'value'
    }

    const b = {
      key: 'value'
    }

    const validation = {
      deepEqual: {
        _message: 'Value must be a deepEqual',
        value: a,
      }
    }

    expect(validate(validation, a)).toEqual(true)
    expect(validate(validation, b)).toEqual(true)
    expect(validate(validation, {
      key: 'value',
      anotherKey: 'anotherValue'
    })).toEqual(false)
  })
})
