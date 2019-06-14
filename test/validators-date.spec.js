import { DateTime } from 'luxon'

import {
  ValidationError,
  validator,
  DATE_VALIDATORS,
} from '../src'

describe('date validators', () => {
  const validate = validator({
    validators: {
      ...DATE_VALIDATORS
    },
    onError: 'returnFalse'
  })

  test('date', () => {
    const validation = {
      date: {
        _message: 'Value must be a date'
      }
    }

    expect(validate(validation, undefined)).toEqual(true)
    expect(validate(validation, null)).toEqual(true)
    expect(validate(validation, new Date())).toEqual(true)
    expect(validate(validation, '2019-06-14')).toEqual(true)
    expect(validate(validation, '2019-14-06')).toEqual(false)
  })

  test('dateMin', () => {
    const validation = {
      dateMin: {
        _message: 'Value must be a date later than',
        threshold: '2019-05-02',
      }
    }

    expect(validate(validation, '2019-06-14')).toEqual(true)
    expect(validate(validation, '2019-05-02')).toEqual(true)
    expect(validate(validation, '2019-05-01')).toEqual(false)
  })

  test('dateMinExclusive', () => {
    const validation = {
      dateMinExclusive: {
        _message: 'Value must be a date later than',
        threshold: '2019-05-02',
      }
    }

    expect(validate(validation, '2019-06-14')).toEqual(true)
    expect(validate(validation, '2019-05-02')).toEqual(false)
    expect(validate(validation, '2019-05-01')).toEqual(false)
  })

  test('dateMax', () => {
    const validation = {
      dateMax: {
        _message: 'Value must be a date later than',
        threshold: '2019-05-02',
      }
    }

    expect(validate(validation, '2019-04-14')).toEqual(true)
    expect(validate(validation, '2019-05-02')).toEqual(true)
    expect(validate(validation, '2019-05-03')).toEqual(false)
  })

  test('dateMaxExclusive', () => {
    const validation = {
      dateMaxExclusive: {
        _message: 'Value must be a date later than',
        threshold: '2019-05-02',
      }
    }

    expect(validate(validation, '2019-04-14')).toEqual(true)
    expect(validate(validation, '2019-05-02')).toEqual(false)
    expect(validate(validation, '2019-05-03')).toEqual(false)
  })
})
