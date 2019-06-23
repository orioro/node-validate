import {
  ValidationError,
  validator,
  MISCELLANEOUS_VALIDATORS,
} from '../src'

describe('miscellaneous validators', () => {
  const validate = validator({
    validators: {
      ...MISCELLANEOUS_VALIDATORS
    },
    onError: 'returnFalse'
  })

  test('instanceOf', () => {
    class Person {
      constructor(name) {
        this.name = name
      }
    }

    const validation = {
      instanceOf: {
        message: 'Value must be instanceof Person',
        constructor: Person
      }
    }

    expect(validate(validation, undefined)).toEqual(true)
    expect(validate(validation, null)).toEqual(true)
    expect(validate(validation, new Person('João'))).toEqual(true)
    expect(validate(validation, { name: 'João' })).toEqual(false)
    expect(validate(validation, 5)).toEqual(false)
  })
})


describe('values validators', () => {
  const validate = validator({
    validators: {
      ...MISCELLANEOUS_VALIDATORS
    },
    onError: 'returnFalse'
  })

  test('valuesAllow', () => {
    const validation = {
      valuesAllow: {
        message: 'Value must be in the allowed values list',
        values: [1, 'option-1', 'option-2', 'option-3']
      }
    }

    expect(validate(validation, undefined)).toEqual(true)
    expect(validate(validation, null)).toEqual(true)
    expect(validate(validation, 'option-1')).toEqual(true)
    expect(validate(validation, 'none-of-the-values')).toEqual(false)
    expect(validate(validation, new Date())).toEqual(false)
    expect(validate(validation, ['option-1', 'option-3'])).toEqual(true)
    expect(validate(validation, ['option-1', 'option-3', 'option-4'])).toEqual(false)
    expect(validate(validation, [])).toEqual(true)
  })

  test('valuesReject', () => {
    const validation = {
      valuesReject: {
        message: 'Value must not be in the rejected values list',
        values: [1, 'option-1', 'option-2', 'option-3']
      }
    }

    expect(validate(validation, undefined)).toEqual(true)
    expect(validate(validation, null)).toEqual(true)
    expect(validate(validation, 'option-1')).toEqual(false)
    expect(validate(validation, 'none-of-the-values')).toEqual(true)
    expect(validate(validation, new Date())).toEqual(true)
    expect(validate(validation, ['option-1', 'option-3'])).toEqual(false)
    expect(validate(validation, ['option-1', 'option-3', 'option-4'])).toEqual(false)
    expect(validate(validation, [])).toEqual(true)
  })
})
