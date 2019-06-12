const {
  ValidationError,
  validator,
  numberValidators,
} = require('../src')

describe('Validator: and', () => {

  const validate = validator({
    validators: {
      ...numberValidators,
    },
    onError: 'returnError'
  })

  test('Should require ALL validations to pass', () => {
    const validation = {
      and: {
        _message: 'Must be multiple of 10 AND not multiple of 3',
        validations: [
          {
            numberMultipleOf: {
              _message: 'Must be multiple of 10',
              multiplier: 10,
            }
          },
          {
            numberMultipleOf: {
              _negative: true,
              _message: 'Must not be multiple of 3',
              multiplier: 3
            }
          }
        ]
      }
    }

    expect(validate(validation, 100)).toEqual(true)

    // Fail first
    const err1 = validate(validation, 5)
    expect(err1).toBeInstanceOf(ValidationError)
    expect(err1.errors.length).toEqual(2)
    expect(err1.errors[0].validatorId).toEqual('and')
    expect(err1.errors[0].message).toEqual('Must be multiple of 10 AND not multiple of 3')
    expect(err1.errors[1].validatorId).toEqual('numberMultipleOf')
    expect(err1.errors[1].message).toEqual('Must be multiple of 10')

    // Fail second
    const err2 = validate(validation, 90)
    expect(err2).toBeInstanceOf(ValidationError)
    expect(err2.errors.length).toEqual(2)
    expect(err2.errors[0].validatorId).toEqual('and')
    expect(err2.errors[0].message).toEqual('Must be multiple of 10 AND not multiple of 3')
    expect(err2.errors[1].validatorId).toEqual('numberMultipleOf')
    expect(err2.errors[1].message).toEqual('Must not be multiple of 3')

    // Fail both
    const err3 = validate(validation, 99)
    expect(err3).toBeInstanceOf(ValidationError)
    expect(err3.errors.length).toEqual(3)
    expect(err3.errors[0].validatorId).toEqual('and')
    expect(err3.errors[0].message).toEqual('Must be multiple of 10 AND not multiple of 3')
    expect(err3.errors[1].validatorId).toEqual('numberMultipleOf')
    expect(err3.errors[1].message).toEqual('Must be multiple of 10')
    expect(err3.errors[2].validatorId).toEqual('numberMultipleOf')
    expect(err3.errors[2].message).toEqual('Must not be multiple of 3')
  })
})
