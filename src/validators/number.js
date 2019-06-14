const getPrecision = value => {
  if (!isFinite(value)) {
    return 0
  }

  let e = 1
  let p = 0

  while (Math.round(value * e) / e !== value) {
    e *= 10
    p++
  }

  return p
}

export const number = ({}, value) => {
  return typeof value === 'number' && !isNaN(value)
}

export const numberMin = ({ threshold }, value) => {
  return number({}, value) && value >= threshold
}

export const numberMinExclusive = ({ threshold }, value) => {
  return number({}, value) && value > threshold
}

export const numberMax = ({ threshold }, value) => {
  return number({}, value) && value <= threshold
}

export const numberMaxExclusive = ({ threshold }, value) => {
  return number({}, value) && value < threshold
}

export const numberMultipleOf = ({ multiplier }, value) => {
  if (Array.isArray(multiplier)) {
    return number({}, value) && multiplier.every(m => value % m === 0)
  } else {
    return number({}, value) && value % multiplier === 0
  }
}

export const numberMaxDecimalPlaces = ({ precision }, value) => {
  return number({}, value) && getPrecision(value) <= precision
}

export const numberInteger = ({}, value) => {
  return Number.isInteger(value)
}
