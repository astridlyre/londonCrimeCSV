import { createReadStream, createWriteStream } from 'fs'
import parse from 'csv-parse'
import { errorExit } from './lib/functions.js'
import { createLineCounter } from './lib/lineCounter.js'
import { TallyCrimeAreas, CrimeAreaResults } from './lib/crimeAreas.js'
import { TallyCrimeYears, CrimeYearResults } from './lib/crimeYears.js'
import { CombineResults } from './lib/results.js'

const csvParser = parse({ columns: true })
const csvStream = createReadStream(process.argv[2] || 'data/data.csv').pipe(csvParser)
const outputFile = process.argv[3] || 'output.json'
const destinationStream = createWriteStream(outputFile, 'utf8', { end: false })
const combinedResults = new CombineResults({
  numberOfStreams: 2,
  destinationStream,
  options: { end: false },
})

csvStream.pipe(createLineCounter(outputFile))

csvStream
  .pipe(new TallyCrimeYears())
  .pipe(new CrimeYearResults())
  .pipe(combinedResults)
  .on('error', errorExit)

csvStream
  .pipe(new TallyCrimeAreas())
  .pipe(new CrimeAreaResults())
  .pipe(combinedResults)
  .on('error', errorExit)
