import {
  ValidationError,
  validator,
  ARRAY_VALIDATORS,
  OBJECT_VALIDATORS,
  STRING_VALIDATORS,
} from '../src'

describe('array validators', () => {

  const validate = validator({
    validators: {
      ...ARRAY_VALIDATORS,
      ...STRING_VALIDATORS,
    },
    onError: 'returnError'
  })

  test('array', () => {
    const validation = {
      array: {
        message: 'Value must be an array'
      }
    }

    expect(validate(validation, [])).toEqual(true)
    expect(validate(validation, {})).toBeInstanceOf(ValidationError)
  })

  test('arrayMinLength', () => {
    const validation = {
      arrayMinLength: {
        length: 3,
      }
    }

    expect(validate(validation, [1, 2, 3])).toEqual(true)
    expect(validate(validation, [1, 2])).toBeInstanceOf(ValidationError)
  })

  test('arrayMaxLength', () => {
    const validation = {
      arrayMaxLength: {
        length: 3,
      }
    }

    expect(validate(validation, [1, 2, 3])).toEqual(true)
    expect(validate(validation, [1, 2, 3, 4])).toBeInstanceOf(ValidationError)
  })

  test('arrayExactLength', () => {
    const validation = {
      arrayExactLength: {
        length: 3,
      }
    }

    expect(validate(validation, [1, 2, 3])).toEqual(true)
    expect(validate(validation, [1, 2, 3, 4])).toBeInstanceOf(ValidationError)
    expect(validate(validation, [1, 2])).toBeInstanceOf(ValidationError)
  })

  test('arrayItems', () => {
    const validation = {
      arrayItems: {
        validation: {
          stringRegExp: {
            regExp: /^[0-9]+$/
          }
        }
      }
    }

    expect(validate(validation, ['123', '225', '4444'])).toEqual(true)
    expect(validate(validation, ['123', '225', 'not-a-digit'])).toBeInstanceOf(ValidationError)
  })

  test('arrayItems async - valid', () => {
    expect.assertions(1)

    const validate = validator({
      validators: {
        ...ARRAY_VALIDATORS,
        asyncAlwaysValid: () => {
          return new Promise(resolve => {
            setTimeout(resolve.bind(null, true), 100)
          })
        },
      },
      onError: 'returnError',
      async: true
    })

    return expect(validate({
      arrayItems: {
        message: 'Some invalid item in the array',
        validation: {
          asyncAlwaysValid: {}
        }
      }
    }, ['item-1', 'item-2'])).resolves.toEqual(true)
  })

  test('arrayItems async - invalid', () => {
    expect.assertions(5)

    const validate = validator({
      validators: {
        ...ARRAY_VALIDATORS,
        asyncAlwaysInvalid: () => {
          return new Promise(resolve => {
            setTimeout(resolve.bind(null, false), 100)
          })
        },
      },
      onError: 'returnError',
      async: true
    })

    return validate({
      arrayItems: {
        message: 'Some invalid item in the array',
        validation: {
          asyncAlwaysInvalid: {
            message: 'This validation is always invalid',
          }
        }
      }
    }, ['item-1', 'item-2'])
    .then(error => {
      expect(error).toBeInstanceOf(ValidationError)
      expect(error.errors).toHaveLength(3)
      expect(error.errors[0].message).toEqual('Some invalid item in the array')
      expect(error.errors[1].message).toEqual('This validation is always invalid')
      expect(error.errors[2].message).toEqual('This validation is always invalid')
    })
  })

  test('arrayItems deep nesting', () => {
    const validate = validator({
      validators: {
        ...STRING_VALIDATORS,
        ...ARRAY_VALIDATORS,
        ...OBJECT_VALIDATORS,
      },
      onError: 'returnError',
    })

    const validation = {
      objectProperties: {
        message: 'Root validation failed',
        properties: {
          title: {
            notNull: {
              message: 'Value is required'
            },
            notUndefined: {
              message: 'Value is required'
            }
          },
          list_of_addresses: {
            notNull: {
              message: 'list_of_addresses is required'
            },
            notUndefined: {
              message: 'list_of_addresses is required'
            },
            arrayMinLength: {
              length: 1,
              message: 'At least one address is required',
            },
            arrayItems: {
              message: 'Some addresses have errors',
              validation: {
                objectProperties: {
                  message: 'Address contains errors',
                  properties: {
                    line_1: {
                      stringMinLength: {
                        length: 10,
                        message: 'Line 1 at least 10'
                      },
                      notNull: {
                        message: 'Value is required'
                      },
                      notUndefined: {
                        message: 'Value is required'
                      }
                    },
                    comments: {
                      arrayMaxLength: {
                        length: 2,
                        message: 'At most 2 comments per address'
                      },
                      arrayItems: {
                        validation: {
                          objectProperties: {
                            properties: {
                              author: {
                                notNull: {
                                  message: 'Value is required'
                                },
                                notUndefined: {
                                  message: 'Value is required'
                                }
                              },
                              contents: {
                                notNull: {
                                  message: 'Value is required'
                                },
                                notUndefined: {
                                  message: 'Value is required'
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    expect(validate(validation, {
      title: 'Some title',
      list_of_addresses: [
        {
          line_1: '1234567890',
          line_2: 'Any value',
          comments: [
            {
              author: 'Somebody',
              contents: 'Some comment!'
            }
          ]
        }
      ]
    }))
    .toEqual(true)

    expect(validate(validation, {
      title: 'Some title',
      list_of_addresses: [
        {
          line_1: '1234567890',
          line_2: 'Any value',
        }
      ],
    }))
    .toEqual(true)

    const error1 = validate(validation, {
      title: 'Some title',
    })

    expect(error1).toBeInstanceOf(ValidationError)
    expect(error1.errors).toHaveLength(2)
    expect(error1.errors[0].message).toEqual('Root validation failed')
    expect(error1.errors[1].message).toEqual('list_of_addresses is required')

    const error2 = validate(validation, {
      title: 'Some title',
      list_of_addresses: []
    })

    expect(error2).toBeInstanceOf(ValidationError)
    expect(error2.errors).toHaveLength(2)
    expect(error2.errors[0].message).toEqual('Root validation failed')
    expect(error2.errors[1].message).toEqual('At least one address is required')

    const error3 = validate(validation, {
      title: 'Some title',
      list_of_addresses: [{
        line_2: 'Some text'
      }]
    })

    expect(error3).toBeInstanceOf(ValidationError)
    expect(error3.errors).toHaveLength(4)
    expect(error3.errors[0].message).toEqual('Root validation failed')
    expect(error3.errors[1].message).toEqual('Some addresses have errors')
    expect(error3.errors[2].message).toEqual('Address contains errors')
    expect(error3.errors[3].message).toEqual('Value is required')
  })
})
