import { ALL_EXPRESSIONS } from '@orioro/expression'
import { ValidationError } from './errors'
import { validateThrow, validateAllThrow } from './validate'

describe('validateThrow(options, validations, value):void', () => {
  const options = {
    interpreters: ALL_EXPRESSIONS
  }

  const VALID_NUMBER = [
    ['$eq', 'number', ['$typeOf']],
    {
      code: 'INVALID_NUMBER',
      message: 'Must be a number'
    }
  ]

  const NUMBER_BETWEEN_1_AND_10 = [
    ['$and', [
      ['$gte', 1],
      ['$lte', 10]
    ]], {
      code: 'OUT_OF_RANGE',
      message: 'Must be a number between 1 and 10'
    }
  ]

	test('when valid', () => {
    expect(validateThrow(
      options,
      [NUMBER_BETWEEN_1_AND_10],
      9
    )).toEqual(undefined)
  })

  test('on validation error', () => {
    const throwOutOfRange = () => {
      validateThrow(
        options,
        [NUMBER_BETWEEN_1_AND_10],
        11
      )
    }

    expect(throwOutOfRange).toThrow(ValidationError)

    const error = (() => {
      try {
        throwOutOfRange()
      } catch (err) {
        return err
      }
    })()

    expect(error.name).toEqual('ValidationError')
    expect(error.errors).toEqual([
      {
        code: 'OUT_OF_RANGE',
        message: 'Must be a number between 1 and 10'
      }
    ])
    expect(error.message).toEqual('Must be a number between 1 and 10')
    expect(error.toJSON()).toEqual({
      name: 'ValidationError',
      message: 'Must be a number between 1 and 10',
      errors: [
        {
          code: 'OUT_OF_RANGE',
          message: 'Must be a number between 1 and 10'
        }
      ],
      value: 11
    })

  })

  test('throw unknown errors', () => {
    // Type verification is not embedded
    expect(() => validateThrow(
      options,
      [
        NUMBER_BETWEEN_1_AND_10
      ],
      '8'
    )).toThrow(TypeError)

    expect(() => validateThrow(
      options,
      [
        VALID_NUMBER,
        NUMBER_BETWEEN_1_AND_10
      ],
      '8'
    )).toThrow(ValidationError)

    // Order matters
    expect(() => validateThrow(
      options,
      [
        NUMBER_BETWEEN_1_AND_10,
        VALID_NUMBER,
      ],
      '8'
    )).toThrow(TypeError)
	})
})

describe('validateAllThrow(options, validations, value):void', () => {
  const options = {
    interpreters: ALL_EXPRESSIONS
  }

  const INVALID_FORMAT = [['$eq', 2, ['$arrayLength']], {
    code: 'INVALID_FORMAT',
    message: 'Range must contain exactly 2 items'
  }]

  const INVALID_START = [['$eq', 'number', ['$typeOf', ['$value', '0']]], {
    code: 'INVALID_START',
    message: 'Start must be a number'
  }]

  const INVALID_END = [['$eq', 'number', ['$typeOf', ['$value', '1']]], {
    code: 'INVALID_END',
    message: 'End must be a number'
  }]

  // const INVALID_RANGE_LIMITS = [['$gte', ['$value', '0'], ['$value', '1']], {
  //   code: 'INVALID_RANGE_LIMITS',
  //   message: 'End must be greater than or equal to start'
  // }]

  test('when valid', () => {
    expect(validateAllThrow(
      options,
      [
        INVALID_FORMAT,
        INVALID_START,
        INVALID_END,
        // INVALID_RANGE_LIMITS
      ],
      [10, 100]
    )).toEqual(undefined)
  })

  test('when some condition is invalid', () => {

    const throwInvalidFormat = () => {
      validateAllThrow(
        options,
        [
          INVALID_FORMAT,
          INVALID_START,
          INVALID_END
        ],
        [0]
      )
    }

    const error = (() => {
      try {
        throwInvalidFormat()
      } catch (err) {
        return err
      }
    })()

    expect(throwInvalidFormat).toThrow(ValidationError)
    expect(error.message).toEqual([
      'Range must contain exactly 2 items',
      'End must be a number'
    ].join('; '))
    expect(error.errors).toHaveLength(2)
  })
})
