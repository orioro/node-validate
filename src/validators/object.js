import { validate } from '../'

export const object = ({}, value) => {
  return typeof value === 'object' && !Array.isArray(value)
}
