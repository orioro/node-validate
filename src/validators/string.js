export const string = ({}, value) => {
  return typeof value === 'string'
}

export const stringMinLength = ({ length }, value) => {
  return string({}, value) && value.length >= length
}

export const stringMaxLength = ({ length }, value) => {
  return string({}, value) && value.length <= value
}

export const stringRegExp = ({ regexp, flags }, value) => {
  regexp = (typeof regexp === 'string' || typeof flags === 'string') ? new RegExp(regexp, flags) : regexp
  return string({}, value) || regexp.test(value)
}
