import {
  ValidationError,
  validator,
  BOOLEAN_VALIDATORS,
} from '../src'

describe('Boolean validators', () => {
  const validate = validator({
    validators: {
      ...BOOLEAN_VALIDATORS
    },
    onError: 'returnFalse'
  })

  test('boolean', () => {
    const validation = {
      boolean: {
        _message: 'Value must be a boolean'
      }
    }

    expect(validate(validation, undefined)).toEqual(true)
    expect(validate(validation, null)).toEqual(true)
    expect(validate(validation, true)).toEqual(true)
    expect(validate(validation, false)).toEqual(true)
    expect(validate(validation, 5)).toEqual(false)
  })
})
