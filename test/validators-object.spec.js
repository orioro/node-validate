import {
  ValidationError,
  validator,
  STRING_VALIDATORS,
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
        message: 'Value must be a object'
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
        message: 'Value must be a plain object'
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
        message: 'Validation of the object failed',
        properties: {
          commentCount: {
            numberMin: {
              threshold: 20,
              message: 'Must be at least 20',
            },
            numberMax: {
              threshold: 30,
              message: 'Must be at most 30',
            }
          },
          categories: {
            arrayMinLength: {
              length: 3,
              message: 'Must contain at least 3 categories'
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
              message: ({value}) => `someProperty ${value} is not equal to TEST`
            }
          },
          someOtherProperty: {
            asyncEqualsToTest: {
              message: ({value}) => `someOtherProperty ${value} is not equal to TEST`
            }
          }
        },
        message: 'Validation of the object failed'
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

  test('objectProperties deep nesting', () => {
    const validateDeep = validator({
      validators: {
        ...STRING_VALIDATORS,
        ...OBJECT_VALIDATORS,
      },
      onError: 'returnError'
    })

    const validation = {
      objectPlain: {
        message: 'must be a plain object'
      },
      objectProperties: {
        message: 'Root has invalid values',
        properties: {
          title: {
            notNull: {
              message: 'Value is required'
            },
            notUndefined: {
              message: 'Value is required'
            }
          },
          description: {
            notNull: {
              message: 'Value is required'
            },
            notUndefined: {
              message: 'Value is required'
            }
          },
          place: {
            objectProperties: {
              message: 'Place has invalid values',
              properties: {
                name: {
                  notNull: {
                    message: 'Value is required'
                  },
                  notUndefined: {
                    message: 'Value is required'
                  }
                },
                address: {
                  notNull: {
                    message: 'Value is required'
                  },
                  notUndefined: {
                    message: 'Value is required'
                  },
                  objectProperties: {
                    message: 'Address has invalid values',
                    properties: {
                      line_1: {
                        stringMinLength: {
                          length: 10,
                          message: 'Address line_1 must have at least 10 chars',
                        },
                        stringMaxLength: {
                          length: 15,
                          message: 'Address line_1 must have at most 15 chars',
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

    expect(validateDeep(validation, {
      title: 'Title',
      description: 'Description',
      place: {
        name: 'Somewhere',
        address: {
          line_1: '123456789012345'
        }
      }
    }))
    .toEqual(true)

    expect(validateDeep(validation, {
      title: 'Title',
      description: 'Description',
      place: {
        name: 'Somewhere',
        address: {}
      }
    }))
    .toEqual(true)

    const error1 = validateDeep(validation, {
      title: 'Title',
      description: 'Description',
      place: {
        name: 'Somewhere',
        address: {
          line_1: '123456789012345 MORE THAN 15'
        }
      }
    })

    expect(error1).toBeInstanceOf(ValidationError)
    expect(error1.errors).toHaveLength(4)
    expect(error1.errors[0].message).toEqual('Root has invalid values')
    expect(error1.errors[1].message).toEqual('Place has invalid values')
    expect(error1.errors[2].message).toEqual('Address has invalid values')
    expect(error1.errors[3].message).toEqual('Address line_1 must have at most 15 chars')

    const error2 = validateDeep(validation, {
      description: 'Description',
      place: {
        name: 'Somewhere',
        address: {
          line_1: '123456789012345'
        }
      }
    })

    expect(error2).toBeInstanceOf(ValidationError)
    expect(error2.errors).toHaveLength(2)
    expect(error2.errors[0].message).toEqual('Root has invalid values')
    expect(error2.errors[1].message).toEqual('Value is required')
  })


  test('objectProperties deep nesting - ASYNC', () => {

    expect.assertions(7)

    const validateDeepAsync = validator({
      async: true,
      validators: {
        stringMinLengthAsync: ({ length }, value) => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(value.length >= length)
            }, 50)
          })
        },
        stringMaxLengthAsync: ({ length }, value) => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(value.length <= length)
            }, 50)
          })
        },
        ...OBJECT_VALIDATORS,
      },
      onError: 'returnError'
    })

    const validation = {
      objectPlain: {
        message: 'must be a plain object'
      },
      objectProperties: {
        message: 'Root has invalid values',
        properties: {
          title: {
            notNull: {
              message: 'Value is required'
            },
            notUndefined: {
              message: 'Value is required'
            }
          },
          description: {
            notNull: {
              message: 'Value is required'
            },
            notUndefined: {
              message: 'Value is required'
            }
          },
          place: {
            objectProperties: {
              message: 'Place has invalid values',
              properties: {
                name: {
                  notNull: {
                    message: 'Value is required'
                  },
                  notUndefined: {
                    message: 'Value is required'
                  }
                },
                address: {
                  notNull: {
                    message: 'Value is required'
                  },
                  notUndefined: {
                    message: 'Value is required'
                  },
                  objectProperties: {
                    message: 'Address has invalid values',
                    properties: {
                      line_1: {
                        stringMinLengthAsync: {
                          length: 10,
                          message: 'Address line_1 must have at least 10 chars',
                        },
                        stringMaxLengthAsync: {
                          length: 15,
                          message: 'Address line_1 must have at most 15 chars',
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

    expect(validateDeepAsync(validation, {
      title: 'Title',
      description: 'Description',
      place: {
        name: 'Somewhere',
        address: {
          line_1: '123456789012345'
        }
      }
    }))
    .resolves.toEqual(true)

    return validateDeepAsync(validation, {
      title: 'Title',
      description: 'Description',
      place: {
        name: 'Somewhere',
        address: {
          line_1: '123456789'
        }
      }
    })
    .then(err => {
      expect(err).toBeInstanceOf(ValidationError)
      expect(err.errors).toHaveLength(4)
      expect(err.errors[0].message).toEqual('Root has invalid values')
      expect(err.errors[1].message).toEqual('Place has invalid values')
      expect(err.errors[2].message).toEqual('Address has invalid values')
      expect(err.errors[3].message).toEqual('Address line_1 must have at least 10 chars')
    })
  })
})
