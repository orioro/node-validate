import isPlainObject from 'lodash.isplainobject'
import { DateTime } from 'luxon'

const _parseDate = (value, format = 'ISO') => {
  if (value instanceof DateTime) {
    return value
  } else if (value instanceof Date) {
    return DateTime.fromJSDate(value)
  } else if (isPlainObject(value)) {
    return DateTime.fromObject(value)
  } else {
    switch (format) {
      case 'ISO':
        return DateTime.fromISO(value)
      case 'RFC2822':
        return DateTime.fromRFC2822(value)
      case 'HTTP':
        return DateTime.fromHTTP(value)
      case 'SQL':
        return DateTime.fromSQL(value)
      case 'ms':
        return DateTime.fromMillis(value)
      case 's':
        return DateTime.fromSeconds(value)
      default:
        return DateTime.fromFormat(value, format)
    }
  }
}

export const date = ({ format }, value) => {
  return _parseDate(value, format).isValid
}

export const dateMin = ({ threshold, format }, value) => {
  value = _parseDate(value, format)
  threshold = _parseDate(threshold, format)

  return value.isValid && threshold.isValid && value >= threshold
}

export const dateMinExclusive = ({ threshold, format }, value) => {
  value = _parseDate(value)
  threshold = _parseDate(threshold, format)

  return value.isValid && threshold.isValid && value > threshold
}

export const dateMax = ({ threshold, format }, value) => {
  value = _parseDate(value)
  threshold = _parseDate(threshold, format)

  return value.isValid && threshold.isValid && value <= threshold
}

export const dateMaxExclusive = ({ threshold, format }, value) => {
  value = _parseDate(value)
  threshold = _parseDate(threshold, format)

  return value.isValid && threshold.isValid && value < threshold
}
