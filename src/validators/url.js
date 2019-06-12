import isUrl from 'is-url'

export const url = ({}, value) => {
  return isUrl(value)
}

export const urlProtocolAllow = ({ protocols }, value) => {

}

export const urlProtocolReject = ({ protocols }, value) => {

}

export const urlDomainAllow = ({ domains }, value) => {
  return url({}, value)
}

export const urlDomainReject = ({ domains }, value) => {
  return url({}, value)
}
