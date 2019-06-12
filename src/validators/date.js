export const date = ({}, value) => {
  return date instanceof Date
}

export const dateMin = ({ threshold }, value) => {
  return date({}, value) && value >= threshold
}

export const dateMinExclusive = ({ threshold }, value) => {
  return date({}, value) && value > threshold
}

export const dateMax = ({ threshold }, value) => {
  return date({}, value) && value <= threshold
}

export const dateMaxExclusive = ({ threshold }, value) => {
  return date({}, value) && value < threshold
}
