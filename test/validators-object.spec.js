import {
  ValidationError,
  validator,
  ARRAY_VALIDATORS,
  NUMBER_VALIDATORS,
  OBJECT_VALIDATORS,
} from '../src'

describe('object validators', () => {
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

  test('objectMatches', () => {
    const validation = {
      objectMatches: {
        query: {
          categories: 'category-A',
          commentCount: {
            $gte: 10,
            $lt: 20
          }
        }
      }
    }

    expect(validate(validation, {
      categories: ['category-A', 'category-B', 'category-C'],
      commentCount: 15
    })).toEqual(true)

    expect(validate(validation, {
      categories: ['category-A', 'category-B', 'category-C'],
      commentCount: 60
    })).toEqual(false)

    expect(validate(validation, {
      categories: ['category-B', 'category-C'],
      commentCount: 15
    })).toEqual(false)

    expect(validate(validation, 4)).toEqual(false)
  })

  test('objectProperties', () => {
    const validateObjectProperties = validator({
      validators: {
        ...ARRAY_VALIDATORS,
        ...NUMBER_VALIDATORS,
        ...OBJECT_VALIDATORS
      },
      onError: 'returnError'
    })

    const validation = {
      objectProperties: {
        _message: 'Validation of the object failed',
        properties: {
          commentCount: {
            numberMin: {
              threshold: 20,
              _message: 'Must be at least 20',
            },
            numberMax: {
              threshold: 30,
              _message: 'Must be at most 30',
            }
          },
          categories: {
            arrayMinLength: {
              length: 3,
              _message: 'Must contain at least 3 categories'
            }
          }
        }
      }
    }

    expect(validateObjectProperties(validation, {
      commentCount: 25,
      categories: ['category-A', 'category-B', 'category-C'],
    }))
    .toEqual(true)

    const error1 = validateObjectProperties(validation, {
      commentCount: 19,
      categories: ['category-A', 'category-B'],
    })

    expect(error1).toBeInstanceOf(ValidationError)
    expect(error1.errors).toHaveLength(3)
    expect(error1.errors[0].message).toEqual('Validation of the object failed')
    expect(error1.errors[1].message).toEqual('Must be at least 20')
    expect(error1.errors[2].message).toEqual('Must contain at least 3 categories')

    const error2 = validateObjectProperties(validation, {
      commentCount: 22,
      categories: ['category-A', 'category-B'],
    })

    expect(error2).toBeInstanceOf(ValidationError)
    expect(error2.errors).toHaveLength(2)
    expect(error2.errors[0].message).toEqual('Validation of the object failed')
    expect(error2.errors[1].message).toEqual('Must contain at least 3 categories')
  })

  test('objectProperties async', () => {
    expect.assertions(10)

    const validateObjectPropertiesAsync = validator({
      validators: {
        ...OBJECT_VALIDATORS,
        asyncEqualsToTest: ({}, value) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(value === 'TEST')
            }, 50)
          })
        },
      },
      onError: 'returnError',
      async: true
    })

    const validation = {
      objectProperties: {
        properties: {
          someProperty: {
            asyncEqualsToTest: {
              _message: ({value}) => `someProperty ${value} is not equal to TEST`
            }
          },
          someOtherProperty: {
            asyncEqualsToTest: {
              _message: ({value}) => `someOtherProperty ${value} is not equal to TEST`
            }
          }
        },
        _message: 'Validation of the object failed'
      }
    }

    expect(validateObjectPropertiesAsync(validation, {
      someProperty: 'TEST'
    }))
    .resolves.toEqual(true)

    return Promise.all([
      validateObjectPropertiesAsync(validation, {
        someProperty: 'SOME OTHER VALUE'
      }),
      validateObjectPropertiesAsync(validation, {
        someProperty: 'SOME OTHER VALUE',
        someOtherProperty: 'AGAIN, ANOTHER VALUE'
      }),
    ])
    .then(([err1, err2]) => {
      expect(err1).toBeInstanceOf(ValidationError)
      expect(err1.errors).toHaveLength(2)
      expect(err1.errors[0].message).toEqual('Validation of the object failed')
      expect(err1.errors[1].message).toEqual('someProperty SOME OTHER VALUE is not equal to TEST')

      expect(err2).toBeInstanceOf(ValidationError)
      expect(err2.errors).toHaveLength(3)
      expect(err2.errors[0].message).toEqual('Validation of the object failed')
      expect(err2.errors[1].message).toEqual('someProperty SOME OTHER VALUE is not equal to TEST')
      expect(err2.errors[2].message).toEqual('someOtherProperty AGAIN, ANOTHER VALUE is not equal to TEST')
    })
  })
})
