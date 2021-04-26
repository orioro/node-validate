# node-validate

```
npm install @orioro/validate
```

Utility methods to validate and generate validations expressions. Based on `@orioro/expression`.

# Use cases

# API

- [`ValidationErrorSpec`](#validationerrorspec)
- [`ValidationCase`](#validationcase)
- [`ValidationError`](#validationerror)
- [`ValidateOptions`](#validateoptions)
- [`normalizeValidationResult(result)`](#normalizevalidationresultresult)
- [`validateSync(validationExpression, value, options)`](#validatesyncvalidationexpression-value-options)
- [`validateAsync(validationExpression, value, options)`](#validateasyncvalidationexpression-value-options)
- [`validateSyncThrow(validationExpression, value, options)`](#validatesyncthrowvalidationexpression-value-options)
- [`validateAsyncThrow(validationExpression, value, options)`](#validateasyncthrowvalidationexpression-value-options)
- [`sequentialCases(cases)`](#sequentialcasescases)
- [`parallelCases(cases)`](#parallelcasescases)
- [`allowValues(allowedValues, validation)`](#allowvaluesallowedvalues-validation)
- [`prohibitValues(prohibitedValues, error, validation)`](#prohibitvaluesprohibitedvalues-error-validation)



##### `ValidationErrorSpec`

- `validationErrorSpec` {Object}
  - `code` {string}
  - `messsage` {string | *}

##### `ValidationCase`





##### `ValidationError`

- `validationError` {Error}
  - `name` {string}
  - `message` {string}
  - `errors` {[[ValidationError](#validationerror)Spec](#validationerrorspec)[]}
  - `value` {*}



##### `ValidateOptions`

Options for calling `validateSync`

- `options` {Object}
  - `interpreters` {Object}

##### `normalizeValidationResult(result)`

Utility function that normalizes the validation result.
Takes as parameter the raw validation result output
(either `ValidationErrorSpec`, `string`, `null`) and returns
either `null` or a non-empty array of objects conforming to
`ValidationErrorSpec`.

- `result` {[[ValidationError](#validationerror)Spec](#validationerrorspec) | string | null | (ValidationErrorSpec | string)[]}
- Returns: {[[ValidationError](#validationerror)Spec](#validationerrorspec)[] | null} 

##### `validateSync(validationExpression, value, options)`

Executes a validation expression against the given value.
Returns either an `Array` of `ValidationErrorSpec` objects
or `null` (which indicates there were no errors found and the
value is valid).

The expression may return one of these values:

- a `string`: is interpreted as an error code and will be
  converted to a `ValidationErrorSpec` (e.g. `'SOME_VALIDATION_ERROR'`
  becomes `{ code: 'SOME_VALIDATION_ERROR' }`)
- an `object`: is interpreted as a `ValidationErrorSpec` and should
  have the properties `code` and `message`
- an `Array`: is interpreted as an array of `ValidationErrorSpec` objects
- `null`: indicates that no errors were found

- `validationExpression` {Expression}
- `value` {*}
- `options` {[ValidateOptions](#validateoptions)}
- Returns: {null | [[ValidationError](#validationerror)Spec](#validationerrorspec)[]} 

##### `validateAsync(validationExpression, value, options)`

- `validationExpression` {Expression}
- `value` {*}
- `options` {[ValidateOptions](#validateoptions)}
- Returns: {Promise<null | [[ValidationError](#validationerror)Spec](#validationerrorspec)[]>} 

##### `validateSyncThrow(validationExpression, value, options)`

Performs same validation process as `validateSync` but if an error
is encountered throws a `ValidationError`.

- `validationExpression` {Expression}
- `value` {*}
- `options` {[ValidateOptions](#validateoptions)}

##### `validateAsyncThrow(validationExpression, value, options)`

- `validationExpression` {Expression}
- `value` {*}
- `options` {[ValidateOptions](#validateoptions)}



##### `sequentialCases(cases)`

Takes an array of `ValidationCases` and returns a `ValidationExpression`
to be used with either `validate` or `validateThrow`.

The returned expression evaluates each case sequentially
and if any of the cases returns a non-`null` value, the
validation is interrupted and remaining cases are not evaluated.

- `cases` {[ValidationCase](#validationcase)[]}
- Returns: {ValidationExpression} 

##### `parallelCases(cases)`

Takes an array of `ValidationCases` and returns a `ValidationExpression`
to be used with either `validate` or `validateThrow`.

The returned expression evaluates all cases in parallel and
returns an array of all errors found.

- `cases` {[ValidationCase](#validationcase)[]}
- Returns: {ValidationExpression} 

##### `allowValues(allowedValues, validation)`

Wraps the given `validationExpression` so that it returns
`null` (no error) if the value equals any of the specified
`allowedValues`.

- `allowedValues` {*[]}
- `validation` {ValidationExpression}
- Returns: {ValidationExpression} 

##### `prohibitValues(prohibitedValues, error, validation)`

Wraps the given `validationExpression` so that it returns
the given `error` if the value specified equals any of the
specified `prohibitedValues`

- `prohibitedValues` {*[]}
- `error` {[[ValidationError](#validationerror)Spec](#validationerrorspec) | string}
- `validation` {ValidationExpression}
- Returns: {ValidationExpression}
