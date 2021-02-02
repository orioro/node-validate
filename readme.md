# node-validate

```
npm install @orioro/validate
```

# Use cases

# API

- [`ValidationErrorSpec`](#validationerrorspec)
- [`ValidationCase`](#validationcase)
- [`ValidationError`](#validationerror)
- [`ValidateOptions`](#validateoptions)
- [`validate(validationExpression, value, options)`](#validatevalidationexpression-value-options)
- [`validateThrow(validationExpression, value, options)`](#validatethrowvalidationexpression-value-options)
- [`sequentialCases(cases)`](#sequentialcasescases)



##### `ValidationErrorSpec`

- `validationErrorSpec` {Object}
  - `code` {string}
  - `messsage` {string}

##### `ValidationCase`





##### `ValidationError`

- `validationError` {Error}
  - `name` {string}
  - `message` {string}
  - `errors` {[ValidationError](#validationerror)Spec[]}
  - `value` {*}



##### `ValidateOptions`

Options for calling `validate`

- `options` {Object}
  - `interpreters` {Object}

##### `validate(validationExpression, value, options)`

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
- `options` {[ValidateOptions](#[validate](#validatevalidationexpression-value-options)options)}
- Returns: {null | [ValidationError](#validationerror)Spec[]} 

##### `validateThrow(validationExpression, value, options)`

Performs same validation process as `validate` but if an error
is encountered throws a `ValidationError`.

- `validationExpression` {Expression}
- `value` {*}
- `options` {[ValidateOptions](#[validate](#validatevalidationexpression-value-options)options)}



##### `sequentialCases(cases)`

- `cases` {[ValidationCase](#validationcase)[]}
- Returns: {ValidationExpression}
