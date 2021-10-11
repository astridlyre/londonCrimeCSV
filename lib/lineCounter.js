import { PassThrough } from 'stream'

export function createLineCounter() {
  const lineCounter = new PassThrough({ objectMode: true })
  lineCounter.on('data', function countLines() {
    this.lineCount = (this.lineCount || 0) + 1
  })
  lineCounter.on('end', function end() {
    console.log(`Processed ${this.lineCount} lines of data.`)
  })
  return lineCounter
}
