import isPlainObject from 'lodash.isplainobject'
import mingo from 'mingo'
import validate from '../validate'

export const object = ({}, value) => {
  return typeof value === 'object' && !Array.isArray(value)
}

export const objectPlain = ({}, value) => {
  return isPlainObject(value)
}

export const objectMatches = ({ query }, value) => {
  query = new mingo.Query(query)

  return query.test(value)
}
