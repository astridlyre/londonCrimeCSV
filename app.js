import { errorExit } from './lib/functions.js'
import { createLineCounter } from './lib/lineCounter.js'
import { TallyCrimeAreas, CrimeAreaResults } from './lib/crimeAreas.js'
import { TallyCrimeYears, CrimeYearResults } from './lib/crimeYears.js'
import { CombineResults } from './lib/results.js'

class CrimeStatistics {
  constructor(inputStream, outputStream) {
    this.inputStream = inputStream

    this.streams = []
    this.inputStream.pipe(createLineCounter())
    this.mergeResults = new CombineResults({
      numberOfStreams: 2,
      outputStream,
      options: { end: false },
    })
  }

  parse() {
    for (const handlers of this.streams) {
      const stream = handlers.reduce(
        (inputStream, handler) =>
          inputStream.pipe(handler).on('error', err => console.error(err)),
        this.inputStream
      )
      stream.pipe(this.mergeResults)
      stream.on('error', errorExit)
    }
    return this
  }

  register(stream) {
    this.streams.push(stream)
    return this
  }
}

export function createApp(inputStream, outputStream) {
  const app = new CrimeStatistics(inputStream, outputStream)
  app.register([new TallyCrimeAreas(), new CrimeAreaResults()])
  app.register([new TallyCrimeYears(), new CrimeYearResults()])
  return app
}
