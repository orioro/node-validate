import validate from '../validate'

export const array = ({}, value) => {
  return Array.isArray(value)
}

export const arrayMinLength = ({ length }, value) => {
  return array({}, value) && value.length >= length
}

export const arrayMaxLength = ({ length }, value) => {
  return array({}, value) && value.length <= length
}

export const arrayItem = ({ validations }, value, options) => {
  return array({}, value) && validate(options, validations, value)
}
