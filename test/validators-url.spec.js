import {
  ValidationError,
  validator,
  URL_VALIDATORS,
} from '../src'

describe('url validators', () => {
  const validate = validator({
    validators: {
      ...URL_VALIDATORS
    },
    onError: 'returnFalse'
  })

  test('url', () => {
    const validation = {
      url: {
        _message: 'Value must be a url'
      }
    }

    expect(validate(validation, undefined)).toEqual(true)
    expect(validate(validation, null)).toEqual(true)
    expect(validate(validation, 'https://example.com')).toEqual(true)
    expect(validate(validation, 'http://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash')).toEqual(true)
    expect(validate(validation, 'www.example.com')).toEqual(false)
    expect(validate(validation, 5)).toEqual(false)
  })

  test('urlProtocolAllow', () => {
    const validation = {
      urlProtocolAllow: {
        protocols: ['https:', 'ssh:'],
      }
    }

    expect(validate(validation, 'https://example.com')).toEqual(true)
    expect(validate(validation, 'ssh://example.com')).toEqual(true)
    expect(validate(validation, 'http://example.com')).toEqual(false)
  })

  test('urlProtocolReject', () => {
    const validation = {
      urlProtocolReject: {
        protocols: ['https:', 'ssh:'],
      }
    }

    expect(validate(validation, 'https://example.com')).toEqual(false)
    expect(validate(validation, 'ssh://example.com')).toEqual(false)
    expect(validate(validation, 'http://example.com')).toEqual(true)
  })

  test('urlHostnameAllow', () => {
    const validation = {
      urlHostnameAllow: {
        hostnames: ['example.com', 'www.example.com'],
      }
    }

    expect(validate(validation, 'https://example.com')).toEqual(true)
    expect(validate(validation, 'ssh://www.example.com')).toEqual(true)
    expect(validate(validation, 'http://www-2.example.com')).toEqual(false)
  })

  test('urlHostnameReject', () => {
    const validation = {
      urlHostnameReject: {
        hostnames: ['example.com', 'www.example.com'],
      }
    }

    expect(validate(validation, 'https://example.com')).toEqual(false)
    expect(validate(validation, 'ssh://www.example.com')).toEqual(false)
    expect(validate(validation, 'http://www-2.example.com')).toEqual(true)
  })
})
