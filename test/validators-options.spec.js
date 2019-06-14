import {
  ValidationError,
  validator,
  OPTIONS_VALIDATORS,
} from '../src'

describe('Options validators', () => {
  const validate = validator({
    validators: {
      ...OPTIONS_VALIDATORS
    },
    onError: 'returnFalse'
  })

  test('optionsAllow', () => {
    const validation = {
      optionsAllow: {
        _message: 'Value must be in the allowed options list',
        options: [1, 'option-1', 'option-2', 'option-3']
      }
    }

    expect(validate(validation, undefined)).toEqual(true)
    expect(validate(validation, null)).toEqual(true)
    expect(validate(validation, 'option-1')).toEqual(true)
    expect(validate(validation, 'none-of-the-options')).toEqual(false)
    expect(validate(validation, new Date())).toEqual(false)
    expect(validate(validation, ['option-1', 'option-3'])).toEqual(true)
    expect(validate(validation, ['option-1', 'option-3', 'option-4'])).toEqual(false)
    expect(validate(validation, [])).toEqual(true)
  })

  test('optionsReject', () => {
    const validation = {
      optionsReject: {
        _message: 'Value must not be in the rejected options list',
        options: [1, 'option-1', 'option-2', 'option-3']
      }
    }

    expect(validate(validation, undefined)).toEqual(true)
    expect(validate(validation, null)).toEqual(true)
    expect(validate(validation, 'option-1')).toEqual(false)
    expect(validate(validation, 'none-of-the-options')).toEqual(true)
    expect(validate(validation, new Date())).toEqual(true)
    expect(validate(validation, ['option-1', 'option-3'])).toEqual(false)
    expect(validate(validation, ['option-1', 'option-3', 'option-4'])).toEqual(false)
    expect(validate(validation, [])).toEqual(true)
  })
})
