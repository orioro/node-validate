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

  test('boolean', () => {
    class Person {
      constructor(name) {
        this.name = name
      }
    }

    const validation = {
      instanceOf: {
        _message: 'Value must be instanceof Person',
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
