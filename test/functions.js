/* eslint func-names: 0 */
import { strict as assert } from 'assert'
import { describe, it } from 'mocha'
import * as functions from '../lib/functions.js'

describe('Functions', function () {
  describe('capitalize()', function () {
    it('should capitalize a word', function () {
      assert.equal(functions.capitalize('hello'), 'Hello')
    })

    it('should capitalize a sentence', function () {
      assert.equal(functions.capitalize('hello world'), 'Hello world')
    })
  })

  describe('percentageChange()', function () {
    it('should calculate negative percentage change', function () {
      assert.equal(functions.percentageChange(10, 5), -50)
    })

    it('should calculate positive percentage change', function () {
      assert.equal(functions.percentageChange(5, 10), 100)
    })
  })

  describe('roundTo(n)', function () {
    it('should round a number to n places', function () {
      assert.equal(functions.roundTo(2)(0.456), 0.46)
    })
  })
})
