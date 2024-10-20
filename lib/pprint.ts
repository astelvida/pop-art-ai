// if (process.env.NODE_ENV !== "production") {
'server-only'

import { inspect } from 'util'

const lines = '<------------>'
export const pp = (o: unknown, label: string = 'OUTPUT', options = {}) => {
  console.log(inspect(o, { showHidden: false, depth: 20, colors: true, ...options }))
}

export const ppv = (o: unknown, label: string = 'OUTPUT') => {
  console.log(`\nppv${lines}${label}${lines}`)
  console.dir(o, { depth: 10, colors: true })
}
