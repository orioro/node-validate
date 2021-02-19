import { Expression } from '@orioro/expression'

/**
 * @typedef {Object} ValidationErrorSpec
 * @property {Object} validationErrorSpec
 * @property {string} validationErrorSpec.code Should be a computer-friendly string
 *                                             which helps identifying the error.
 *                                             Usually not shown to the end-user.
 * @property {string | *} [validationErrorSpec.messsage] Should be a human-friendly string
 *                                                       that might be showdn to the end-user
 *                                                       and explain the error's circumstances
 *                                                       and possible solutions.
 */
export type ValidationErrorSpec = {
  code: string
  message?: string | any // Allow {any} in order to support custom message generators / formats
  [key: string]: any
}

/**
 * @typedef {[Expression, ValidationErrorSpec]} ValidationCase
 */
export type ValidationCase = [Expression, ValidationErrorSpec | string]
