export const instanceOf = (config, value) => {
  return value instanceof config.constructor
}

export const valuesAllow = ({ values }, value) => {
  return Array.isArray(value) ?
    value.every(v => values.indexOf(v) !== -1) :
    values.indexOf(value) !== -1
}

export const valuesReject = ({ values }, value) => {
  return Array.isArray(value) ?
    value.every(v => values.indexOf(v) === -1) :
    values.indexOf(value) === -1
}
