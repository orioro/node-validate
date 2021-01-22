import { BooleanExpression } from '@orioro/expression'

export type ValidationErrorSpec = {
  code: string,
  message: string,
  [key: string]: any
}

export type ValidationCase = [BooleanExpression, ValidationErrorSpec]
