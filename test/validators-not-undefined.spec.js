const {
  ValidationError,
  validator,
  NUMBER_VALIDATORS,
} = require('../src')

describe('notUndefined validator', () => {

  const validate = validator({
    validators: {
      ...NUMBER_VALIDATORS,
    },
    onError: 'returnError'
  })

  test('Should fail when invoked with undefined', () => {
    const validations = {
      notUndefined: {
        _message: 'Value must not be undefined',
      }
    }

    const err = validate(validations, undefined)

    expect(err).toBeInstanceOf(ValidationError)
    expect(err.errors).toEqual(expect.arrayContaining([
      new Error('Value must not be undefined')
    ]))
    expect(validate(validations, 100)).toEqual(true)
    expect(validate(validations, 10)).toEqual(true)
    expect(validate(validations, 'STRING')).toEqual(true)
  })

  test('When used in combination with other validators', () => {
    expect(validate({
      number: true
    }, undefined)).toEqual(true)

    expect(validate({
      number: true,
      notUndefined: true
    }, 5)).toEqual(true)

    expect(validate({
      number: true,
      notUndefined: true
    }, null)).toEqual(true)

    const err1 = validate({
      number: true,
      notUndefined: true
    }, undefined)
    expect(err1).toBeInstanceOf(ValidationError)
    expect(err1.errors.length).toEqual(1)
    expect(err1.errors[0].validatorId).toEqual('notUndefined')

    const err2 = validate({
      number: true,
      notUndefined: true
    }, 'NOT A NUMBER')
    expect(err2).toBeInstanceOf(ValidationError)
    expect(err2.errors.length).toEqual(1)
    expect(err2.errors[0].validatorId).toEqual('number')
  })
})
