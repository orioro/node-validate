import { Expression } from '@orioro/expression'
import { ValidationCase } from './types'

export const sequentialCases = (
  cases:ValidationCase[]
):Expression => ([
  '$switch',
  cases.map(([condition, error]) => ([
    ['$not', condition],
    error
  ])),
  null
])

export const parallelCases = (
  cases:ValidationCase[]
):Expression => ([
  '$pipe',
  [
    [
      '$arrayMap',
      [
        '$if',
        ['$evaluate', ['$value', '0'], ['$value', '$$PARENT_SCOPE']],
        null,
        ['$value', '1']
      ],
      cases
    ],
    [
      '$arrayFilter',
      ['$notEq', null]
    ]
  ]
])

export const allowValues = (
  values:any[],
  validation:Expression
):Expression => ([
  '$if',
  ['$in', values],
  null,
  validation
])
