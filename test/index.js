/**
 * Imports
 */

import test from 'tape'
import autoYield from '../src'

/**
 * Tests
 */

test('should work', () => {
  console.log('yield', autoYield(`
  import co from 'co'

  co(function main () {
    move()
  })

  function * move () {
    yield 'moving'
  }
  `, []))
})
