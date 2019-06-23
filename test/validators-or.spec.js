const {
  ValidationError,
  validator,
  NUMBER_VALIDATORS,
  LOGICAL_VALIDATORS,
} = require('../src')

describe('or validator', () => {

  const validate = validator({
    validators: {
      ...NUMBER_VALIDATORS,
      ...LOGICAL_VALIDATORS,
    },
    onError: 'returnError'
  })

  test('Should require ONE OF THE validations to pass', () => {
    const validation = {
      or: {
        message: 'Must be multiple of 10 OR multiple of 3',
        validations: [
          {
            numberMultipleOf: {
              message: 'Must be multiple of 10',
              multiplier: 10,
            }
          },
          {
            numberMultipleOf: {
              message: 'Must be multiple of 3',
              multiplier: 3
            }
          }
        ]
      }
    }

    // multiple of 10 but not 3
    expect(validate(validation, 100)).toEqual(true)

    // multiple of 3 but not 10
    expect(validate(validation, 6)).toEqual(true)

    // prime number, not multiple of any of them
    const err3 = validate(validation, 17)
    expect(err3).toBeInstanceOf(ValidationError)
    expect(err3.errors.length).toEqual(3)
    expect(err3.errors[0].validatorId).toEqual('or')
    expect(err3.errors[0].message).toEqual('Must be multiple of 10 OR multiple of 3')
    expect(err3.errors[1].validatorId).toEqual('numberMultipleOf')
    expect(err3.errors[1].message).toEqual('Must be multiple of 10')
    expect(err3.errors[2].validatorId).toEqual('numberMultipleOf')
    expect(err3.errors[2].message).toEqual('Must be multiple of 3')
  })
})
