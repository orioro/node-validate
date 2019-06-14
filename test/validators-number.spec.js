const {
  ValidationError,
  validator,
  NUMBER_VALIDATORS,
} = require('../src')

describe('Number validators', () => {

  const validate = validator({
    validators: {
      ...NUMBER_VALIDATORS,
    },
    onError: 'returnError'
  })

  test('number (any number or undefined/null)', () => {
    const validations = {
      number: true,
    }

    expect(validate(validations, undefined)).toEqual(true)
    expect(validate(validations, null)).toEqual(true)
    expect(validate(validations, 100)).toEqual(true)
    expect(validate(validations, 10)).toEqual(true)
    expect(validate(validations, 'STRING')).toBeInstanceOf(ValidationError)
    expect(validate(validations, NaN)).toBeInstanceOf(ValidationError)
  })

  test('numberMin', () => {
    const validations = {
      numberMin: {
        threshold: 10
      }
    }

    expect(validate(validations, undefined)).toEqual(true)
    expect(validate(validations, null)).toEqual(true)
    expect(validate(validations, 100)).toEqual(true)
    expect(validate(validations, 10)).toEqual(true)
    expect(validate(validations, 9)).toBeInstanceOf(ValidationError)
  })

  test('numberMinExclusive', () => {
    const validations = {
      numberMinExclusive: {
        threshold: 10,
      }
    }

    expect(validate(validations, undefined)).toEqual(true)
    expect(validate(validations, null)).toEqual(true)
    expect(validate(validations, 100)).toEqual(true)
    expect(validate(validations, 10)).toBeInstanceOf(ValidationError)
    expect(validate(validations, 9)).toBeInstanceOf(ValidationError)
  })

  test('numberMax', () => {
    const validations = {
      numberMax: {
        threshold: 10,
      }
    }

    expect(validate(validations, undefined)).toEqual(true)
    expect(validate(validations, null)).toEqual(true)
    expect(validate(validations, 8)).toEqual(true)
    expect(validate(validations, 10)).toEqual(true)
    expect(validate(validations, 11)).toBeInstanceOf(ValidationError)
  })

  test('numberMaxExclusive', () => {
    const validations = {
      numberMaxExclusive: {
        threshold: 10,
      },
    }

    expect(validate(validations, undefined)).toEqual(true)
    expect(validate(validations, null)).toEqual(true)
    expect(validate(validations, 8)).toEqual(true)
    expect(validate(validations, 10)).toBeInstanceOf(ValidationError)
    expect(validate(validations, 11)).toBeInstanceOf(ValidationError)
  })

  test('numberMultipleOf', () => {
    const validations = {
      numberMultipleOf: {
        multiplier: 7
      }
    }

    expect(validate(validations, null)).toEqual(true)
    expect(validate(validations, 21)).toEqual(true)
    expect(validate(validations, 22)).toBeInstanceOf(ValidationError)
  })

  test('numberMultipleOf (array of multipliers)', () => {
    const validations = {
      numberMultipleOf: {
        multiplier: [2, 3, 5]
      }
    }

    expect(validate(validations, 30)).toEqual(true)
    expect(validate(validations, 4)).toBeInstanceOf(ValidationError)
    expect(validate(validations, 6)).toBeInstanceOf(ValidationError)
    expect(validate(validations, 15)).toBeInstanceOf(ValidationError)
  })

  test('numberInteger', () => {
    const validations = {
      numberInteger: true,
    }

    expect(validate(validations, null)).toEqual(true)
    expect(validate(validations, 10)).toEqual(true)
    expect(validate(validations, 10.1)).toBeInstanceOf(ValidationError)
  })

  test('numberMaxDecimalPlaces', () => {
    const validations = {
      numberMaxDecimalPlaces: {
        precision: 2
      }
    }

    expect(validate(validations, null)).toEqual(true)
    expect(validate(validations, Infinity)).toEqual(true)
    expect(validate(validations, 10.1)).toEqual(true)
    expect(validate(validations, 10.12)).toEqual(true)
    expect(validate(validations, 10.123)).toBeInstanceOf(ValidationError)
  })
})
