/**
 * Imports
 */

import test from 'tape'
import autoYield from '../src'

/**
 * Tests
 */

test('should add yield', (t) => {
  var code = autoYield(`
  function main () {
    move()
  }

  function * move () {
    yield 'moving'
  }
  `)

  var out = `function* main() {
  yield move();
}

function* move() {
  yield 'moving';
}`

  t.equal(code, out)
  t.end()
})

test('should add yield for imported', (t) => {
  var code = autoYield(`
  var move = require('move')

  function main () {
    move()
  }
  `, ['move'])

  var out = `
var move = require('move');

function* main() {
  yield move();
}`

  t.equal(code, out)
  t.end()
})


test('should add yield for imported objects', (t) => {
  var code = autoYield(`
  const { move } = require('ev3')

  function main () {
    move.rotations()
  }
  `, ['move'])

  var out = `
const { move } = require('ev3');

function* main() {
  yield move.rotations();
}`

  t.equal(code, out)
  t.end()
})

// TODO: add support
// test('should add yield for generator methods', (t) => {
//   var code = autoYield(`
//   function main () {
//     move.rotations()
//   }
//
//   const move = {
//     rotations: function * () {
//       yield 'rotate'
//     }
//   }
//   `)
//
//   var out = `
// function* main() {
//   yield move.rotations();
// }
//
// const move = {
//   rotations: function * () {
//     yield 'rotate';
//   }
// }`
//
//   t.equal(code, out)
//   t.end()
// })
