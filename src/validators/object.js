import isPlainObject from 'lodash.isplainobject'
import validate from '../validate'

export const object = ({}, value) => {
  return typeof value === 'object' && !Array.isArray(value)
}

export const objectPlain = ({}, value) => {
  return isPlainObject(value)
}
