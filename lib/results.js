import { Transform } from 'stream'
import { errorExit } from './functions.js'

export class CombineResults extends Transform {
  constructor({ numberOfStreams, outputStream, options = {} } = {}) {
    super({ ...options, objectMode: true })
    this.result = {}
    this.streams = numberOfStreams
    this.dest = outputStream
    this.pipe(this.dest).on('error', errorExit)
  }

  _transform(record, _enc, done) {
    this.result = { ...this.result, ...record }
    this.streams--
    if (this.streams === 0) {
      queueMicrotask(() => {
        this.dest.end()
        this.end()
      })
    }
    done()
  }

  _flush(done) {
    this.push(JSON.stringify(this.result))
    done()
  }

  get done() {
    return this.streams === 0
  }
}
