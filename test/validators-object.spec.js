import {
  ValidationError,
  validator,
  OBJECT_VALIDATORS,
} from '../src'

describe('Object validators', () => {
  const validate = validator({
    validators: {
      ...OBJECT_VALIDATORS
    },
    onError: 'returnFalse'
  })

  test('object', () => {
    const validation = {
      object: {
        _message: 'Value must be a object'
      }
    }

    expect(validate(validation, undefined)).toEqual(true)
    expect(validate(validation, null)).toEqual(true)
    expect(validate(validation, {})).toEqual(true)
    expect(validate(validation, 5)).toEqual(false)
  })

  test('objectPlain', () => {
    const validation = {
      objectPlain: {
        _message: 'Value must be a plain object'
      }
    }

    class Test {
      constructor() {
        this.property = 'value'
      }
    }

    expect(validate(validation, undefined)).toEqual(true)
    expect(validate(validation, null)).toEqual(true)
    expect(validate(validation, {})).toEqual(true)
    expect(validate(validation, new Test())).toEqual(false)
  })
})
