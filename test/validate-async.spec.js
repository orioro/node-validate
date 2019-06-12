const {
  ValidationError,
  validator,
  numberValidators,
} = require('../src')

describe('Validate Async', () => {

  const shouldHaveRejected = res => {
    throw new Error('Should have rejected')
  }

  const validate = validator({
    async: true,
    validators: {
      ...numberValidators,
      asyncUnique: ({}, value) => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve([
              'id-one',
              'id-two',
              'id-three',
              'id-four'
            ].indexOf(value) === -1)
          }, 50)
        })
      },

      asyncWithinRange: ({ max, min }, value) => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(value >= min && value <= max)
          }, 50)
        })
      },

      syncThrowError: ({}, value) => {
        throw new Error('Test sync thrown error')
      },
      syncReturnFalse: ({}, value) => {
        return false
      },
      syncReturnError: ({}, value) => {
        return new Error('Test sync returned error')
      },

      asyncThrowError: ({}, value) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('Test async thrown error'))
          }, 50)
        })
      },
      asyncReturnFalse: ({}, value) => {
        return new Promise(resolve => {
          setTimeout(resolve.bind(null, false), 50)
        })
      },
      asyncReturnError: ({}, value) => {
        return new Promise(resolve => {
          setTimeout(resolve.bind(null, new Error('Test async returned error')), 50)
        })
      }
    }
  })

  test('configuration error is thrown sync', () => {
    expect(() => {
      validate({
        undefinedValidator: {}
      }, 'id-one')
    })
    .toThrow('Validator `undefinedValidator` is not defined')
  })

  test('basic: valid', () => {
    return expect(validate({
      asyncUnique: {
        _message: 'Value must be unique'
      }
    }, 'unique-id')).resolves.toEqual(true)
  })

  test('basic: invalid', () => {
    expect.assertions(4)
    return validate({
      asyncUnique: {
        _message: 'Value must be unique'
      }
    }, 'id-one')
    .then(shouldHaveRejected, err => {
      expect(err).toBeInstanceOf(ValidationError)
      expect(err.errors).toHaveLength(1)
      expect(err.errors[0].message).toEqual('Value must be unique')
      expect(err.errors[0].validatorId).toEqual('asyncUnique')
    })
  })

  test('syncThrowError', () => {
    expect.assertions(4)
    return validate({
      syncThrowError: {}
    }, 'any-value')
    .then(shouldHaveRejected, err => {
      expect(err).toBeInstanceOf(ValidationError)
      expect(err.errors).toHaveLength(1)
      expect(err.errors[0].validatorId).toEqual('syncThrowError')
      expect(err.errors[0].message).toEqual('Test sync thrown error')
    })
  })

  test('syncReturnFalse', () => {
    expect.assertions(3)
    return validate({
      syncReturnFalse: {}
    }, 'any-value')
    .then(shouldHaveRejected, err => {
      expect(err).toBeInstanceOf(ValidationError)
      expect(err.errors).toHaveLength(1)
      expect(err.errors[0].validatorId).toEqual('syncReturnFalse')
    })
  })

  test('syncReturnError', () => {
    expect.assertions(4)
    return validate({
      syncReturnError: {}
    }, 'any-value')
    .then(shouldHaveRejected, err => {
      expect(err).toBeInstanceOf(ValidationError)
      expect(err.errors).toHaveLength(1)
      expect(err.errors[0].validatorId).toEqual('syncReturnError')
      expect(err.errors[0].message).toEqual('Test sync returned error')
    })
  })

  test('asyncThrowError', () => {
    expect.assertions(4)
    return validate({
      asyncThrowError: {}
    }, 'any-value')
    .then(shouldHaveRejected, err => {
      expect(err).toBeInstanceOf(ValidationError)
      expect(err.errors).toHaveLength(1)
      expect(err.errors[0].validatorId).toEqual('asyncThrowError')
      expect(err.errors[0].message).toEqual('Test async thrown error')
    })
  })

  test('asyncReturnFalse', () => {
    expect.assertions(3)
    return validate({
      asyncReturnFalse: {}
    }, 'any-value')
    .then(shouldHaveRejected, err => {
      expect(err).toBeInstanceOf(ValidationError)
      expect(err.errors).toHaveLength(1)
      expect(err.errors[0].validatorId).toEqual('asyncReturnFalse')
    })
  })

  test('asyncReturnError', () => {
    expect.assertions(4)
    return validate({
      asyncReturnError: {}
    }, 'any-value')
    .then(shouldHaveRejected, err => {
      expect(err).toBeInstanceOf(ValidationError)
      expect(err.errors).toHaveLength(1)
      expect(err.errors[0].validatorId).toEqual('asyncReturnError')
      expect(err.errors[0].message).toEqual('Test async returned error')
    })
  })

  //
  test('negative - syncThrowError', () => {
    expect.assertions(1)
    return expect(validate({
      syncThrowError: { _negative: true }
    }, 'any-value')).resolves.toEqual(true)
  })

  test('negative - syncReturnFalse', () => {
    expect.assertions(1)
    return expect(validate({
      syncReturnFalse: { _negative: true }
    }, 'any-value')).resolves.toEqual(true)
  })

  test('negative - syncReturnError', () => {
    expect.assertions(1)
    return expect(validate({
      syncReturnError: { _negative: true }
    }, 'any-value')).resolves.toEqual(true)
  })

  test('negative - asyncThrowError', () => {
    expect.assertions(1)
    return expect(validate({
      asyncThrowError: { _negative: true }
    }, 'any-value')).resolves.toEqual(true)
  })

  test('negative - asyncReturnFalse', () => {
    expect.assertions(1)
    return expect(validate({
      asyncReturnFalse: { _negative: true }
    }, 'any-value')).resolves.toEqual(true)
  })

  test('negative - asyncReturnError', () => {
    expect.assertions(1)
    return expect(validate({
      asyncReturnError: { _negative: true }
    }, 'any-value')).resolves.toEqual(true)
  })

  //

  test('and - valid', () => {
    return expect(validate({
      and: {
        validations: [
          {
            asyncWithinRange: {
              min: 0,
              max: 50,
            }
          },
          {
            asyncWithinRange: {
              min: 45,
              max: 100
            }
          }
        ]
      }
    }, 47)).resolves.toEqual(true)
  })

  test('and - invalid', () => {
    expect.assertions(6)
    return validate({
      and: {
        _message: 'Must be within both ranges',
        validations: [
          {
            asyncWithinRange: {
              min: 0,
              max: 50,
              _message: 'Must be between 0 and 50'
            }
          },
          {
            asyncWithinRange: {
              min: 45,
              max: 100,
              _message: 'Must be between 45 and 100'
            }
          }
        ]
      }
    }, 70)
    .then(shouldHaveRejected, err => {
      expect(err).toBeInstanceOf(ValidationError)
      expect(err.errors).toHaveLength(2)
      expect(err.errors[0].validatorId).toEqual('and')
      expect(err.errors[0].message).toEqual('Must be within both ranges')
      expect(err.errors[1].validatorId).toEqual('asyncWithinRange')
      expect(err.errors[1].message).toEqual('Must be between 0 and 50')
    })
  })

  test('or - valid', () => {
    expect.assertions(1)
    return expect(validate({
      or: {
        validations: [
          {
            asyncWithinRange: {
              min: 0,
              max: 30,
            }
          },
          {
            asyncWithinRange: {
              min: 70,
              max: 100
            }
          }
        ]
      }
    }, 90)).resolves.toEqual(true)
  })

  test('or - invalid', () => {
    expect.assertions(1)
    return validate({
      or: {
        validations: [
          {
            asyncWithinRange: {
              min: 0,
              max: 30,
            }
          },
          {
            asyncWithinRange: {
              min: 70,
              max: 100
            }
          }
        ]
      }
    }, 50)
    .then(shouldHaveRejected, err => {
      expect(err).toBeInstanceOf(ValidationError)
    })
  })
})
