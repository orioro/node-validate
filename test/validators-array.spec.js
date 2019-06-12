const {
  ValidationError,
  validator,
  numberValidators,
} = require('../src')

describe('notNull', () => {

  const validate = validator({
    validators: {
      ...numberValidators,
    },
    onError: 'returnError'
  })

  test('Should fail when invoked with null', () => {
    const validations = {
      notNull: {
        _message: 'Value must not be null',
      }
    }

    const err = validate(validations, null)

    expect(err).toBeInstanceOf(ValidationError)
    expect(err.errors).toEqual(expect.arrayContaining([
      new Error('Value must not be null')
    ]))
    expect(validate(validations, 100)).toEqual(true)
    expect(validate(validations, 10)).toEqual(true)
    expect(validate(validations, 'STRING')).toEqual(true)
  })

  test('When used in combination with other validators', () => {
    expect(validate({
      number: true
    }, null)).toEqual(true)

    expect(validate({
      number: true,
      notNull: true
    }, 5)).toEqual(true)

    expect(validate({
      number: true,
      notNull: true
    }, undefined)).toEqual(true)

    const err1 = validate({
      number: true,
      notNull: true
    }, null)
    expect(err1).toBeInstanceOf(ValidationError)
    expect(err1.errors.length).toEqual(1)
    expect(err1.errors[0].validatorId).toEqual('notNull')

    const err2 = validate({
      number: true,
      notNull: true
    }, 'NOT A NUMBER')
    expect(err2).toBeInstanceOf(ValidationError)
    expect(err2.errors.length).toEqual(1)
    expect(err2.errors[0].validatorId).toEqual('number')
  })
})
