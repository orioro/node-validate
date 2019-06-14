import isEqual from 'lodash.isequal'

export const identity = ({ value }, v) => {
  return v === value
}

export const deepEqual = ({ value }, v) => {
  return isEqual(value, v)
}
