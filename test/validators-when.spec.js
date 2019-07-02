const {
  ValidationError,
  validator,
  VALIDATORS,
} = require('../src')

describe('or validator', () => {

  const validate = validator({
    validators: VALIDATORS,
    onError: 'returnError'
  })

  test('Should conditionally apply validations', () => {
    const validation = {
      objectProperties: {
        properties: {
          age: {
            numberInteger: {
              message: 'Age must be an integer'
            },
          },
          legalResponsible: {
            string: {
              message: 'Legal responsible must be a string'
            }
          }
        }
      },
      when: {
        message: 'Conditional validations failed',
        cases: [
          {
            criteria: { age: { $lt: 18 } },
            validation: {
              objectProperties: {
                message: 'Legal responsible is required when age is < 18',
                properties: {
                  legalResponsible: {
                    notUndefined: {},
                    notNull: {}
                  }
                }
              }
            }
          },
          {
            criteria: { age: { $lt: 10 } },
            validation: {
              objectProperties: {
                message: 'Special legal agreement must be set to true',
                properties: {
                  specialLegalAgreement: {
                    notUndefined: {},
                    notNull: {},
                    identity: {
                      value: true,
                    }
                  }
                }
              }
            },
          }
        ]
      }
    }

    expect(validate(validation, {
      age: 20
    }))
    .toEqual(true)

    expect(validate(validation, {
      age: 17,
      legalResponsible: 'Some legal person'
    }))
    .toEqual(true)

    const error1 = validate(validation, {
      age: 17
    })

    expect(error1).toBeInstanceOf(ValidationError)
    expect(error1.errors).toHaveLength(3)


    expect(validate(validation, {
      age: 9,
      legalResponsible: 'Some legal person',
      specialLegalAgreement: true
    }))
    .toEqual(true)

    const error2 = validate(validation, {
      age: 9,
      legalResponsible: 'Some legal person',
      specialLegalAgreement: false
    })

    console.log(JSON.stringify(error2, null, '  '))

    expect(error2).toBeInstanceOf(ValidationError)
    expect(error2.errors).toHaveLength(3)
  })
})
