import validate from '../validate'

export const object = ({}, value) => {
  return typeof value === 'object' && !Array.isArray(value)
}
