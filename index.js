import { createReadStream, createWriteStream } from 'fs'
import parse from 'csv-parse'
import { createApp } from './app.js'

const csvParser = parse({ columns: true })
const csvStream = createReadStream(process.argv[2] || './data/data.csv').pipe(csvParser)
const outputFile = process.argv[3] || 'output.json'
const destinationStream = createWriteStream(outputFile, 'utf8', { end: false })

const app = createApp(csvStream, destinationStream, { countLines: true })
app.parse()
