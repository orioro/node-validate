export const optionsAllow = ({ options }, value) => {
  return Array.isArray(value) ?
    value.every(v => options.indexOf(v) !== -1) :
    options.indexOf(value) !== -1
}

export const optionsReject = ({ options }, value) => {
  return Array.isArray(value) ?
    value.every(v => options.indexOf(v) === -1) :
    options.indexOf(value) === -1
}
