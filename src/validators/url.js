import isUrl from 'is-url'

export const url = ({}, value) => {
  return typeof value === 'string' && isUrl(value)
}

export const urlProtocolAllow = ({ protocols }, value) => {
  return url({}, value) && protocols.indexOf((new URL(value)).protocol) !== -1
}

export const urlProtocolReject = ({ protocols }, value) => {
  return url({}, value) && protocols.indexOf((new URL(value)).protocol) === -1
}

export const urlHostnameAllow = ({ hostnames }, value) => {
  return url({}, value) && hostnames.indexOf((new URL(value)).hostname) !== -1
}

export const urlHostnameReject = ({ hostnames }, value) => {
  return url({}, value) && hostnames.indexOf((new URL(value)).hostname) === -1
}
