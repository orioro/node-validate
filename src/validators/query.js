import mingo from 'mingo'

export const queryMatch = (criteria, value) => {
  const query = new mingo.Query(criteria)

  return query.test(value)
}
