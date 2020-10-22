import { ALL_EXPRESSIONS } from '@orioro/expression'
import { validate, validateAll } from './validate'

describe('validate(options, validations, value):error | null', () => {
	test('number range', () => {
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

    expect(validate(
      options,
      [NUMBER_BETWEEN_1_AND_10],
      9
    )).toEqual(null)

    expect(validate(
      options,
      [NUMBER_BETWEEN_1_AND_10],
      11
    )).toEqual({
      code: 'OUT_OF_RANGE',
      message: 'Must be a number between 1 and 10'
    })

    expect(validate(
      options,
      [NUMBER_BETWEEN_1_AND_10],
      0
    )).toEqual({
      code: 'OUT_OF_RANGE',
      message: 'Must be a number between 1 and 10'
    })

    // Type verification is not embedded
    expect(() => validate(
      options,
      [
        NUMBER_BETWEEN_1_AND_10
      ],
      '8'
    )).toThrow(TypeError)

    expect(validate(
      options,
      [
        VALID_NUMBER,
        NUMBER_BETWEEN_1_AND_10
      ],
      '8'
    )).toEqual({
      code: 'INVALID_NUMBER',
      message: 'Must be a number'
    })

    // Order matters
    expect(() => validate(
      options,
      [
        NUMBER_BETWEEN_1_AND_10,
        VALID_NUMBER,
      ],
      '8'
    )).toThrow(TypeError)
	})
})
