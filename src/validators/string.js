export const string = ({}, value) => {
  return typeof value === 'string'
}

export const stringMinLength = ({ length }, value) => {
  return string({}, value) && value.length >= length
}

export const stringMaxLength = ({ length }, value) => {
  return string({}, value) && value.length <= length
}

export const stringRegExp = ({ regExp, flags }, value) => {
  regExp = (typeof regExp === 'string' || typeof flags === 'string') ? new RegExp(regExp, flags) : regExp
  return string({}, value) && regExp.test(value)
}
