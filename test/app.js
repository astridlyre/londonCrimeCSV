/* eslint func-names: 0 */
import { strict as assert } from 'assert'
import { Transform } from 'stream'
import { createReadStream } from 'fs'
import { describe, it } from 'mocha'
import parse from 'csv-parse'
import { createApp } from '../app.js'

const testData = './data/test.csv'

describe('App', function () {
  let csvParser
  let inputStream
  let outputStream

  beforeEach(() => {
    csvParser = parse({ columns: true })
    inputStream = createReadStream(testData).pipe(csvParser)
  })

  it('should collect crime area data', function (done) {
    function runTest(result) {
      assert.equal(result.mostDangerousArea.name, 'sutton')
      assert.equal(result.mostDangerousArea.crimes, 5)
      done()
    }

    outputStream = new Transform({
      objectMode: true,
      end: false,
      transform(data, _enc, cb) {
        this.result = JSON.parse(data)
        cb()
      },
      flush(cb) {
        try {
          runTest(this.result)
        } catch (err) {
          console.error(err)
          done(err)
        }
        cb()
      },
    })
    const app = createApp(inputStream, outputStream)
    app.parse()
  })

  it('should collection crime year data', function (done) {
    function runTest(result) {
      assert.equal(Array.isArray(result.crimeYears), true)
      assert.equal(result.crimeYears.length, 9)
      done()
    }

    outputStream = new Transform({
      objectMode: true,
      end: false,
      transform(data, _enc, cb) {
        this.result = JSON.parse(data)
        cb()
      },
      flush(cb) {
        try {
          runTest(this.result)
        } catch (err) {
          console.error(err)
          done(err)
        }
        cb()
      },
    })
    const app = createApp(inputStream, outputStream)
    app.parse()
  })

  it('should have most common and least common crimes', function (done) {
    function runTest(result) {
      assert.deepEqual(result.mostCommonCrimes.southwark, { theftAndHandling: 4 })
      assert.deepEqual(result.leastCommonCrimes.kingstonUponThames, {
        theftAndHandling: 1,
      })
      done()
    }

    outputStream = new Transform({
      objectMode: true,
      end: false,
      transform(data, _enc, cb) {
        this.result = JSON.parse(data)
        cb()
      },
      flush(cb) {
        try {
          runTest(this.result)
        } catch (err) {
          console.error(err)
          done(err)
        }
        cb()
      },
    })
    const app = createApp(inputStream, outputStream)
    app.parse()
  })
})
