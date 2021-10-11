import { Transform } from 'stream'
import { roundTo, percentageChange } from './functions.js'

export class CrimeYearResults extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true })
  }

  _transform(record, _enc, done) {
    this.results = {
      crimeYears: record.map(r => r.toJSON()),
      percentageChange: roundTo(2)(
        percentageChange(record[0].crimes, record[record.length - 1].crimes)
      ),
    }
    done()
  }

  _flush(done) {
    this.push(this.results || {})
    done()
  }
}

export class TallyCrimeYears extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true })
    this.years = Object.create(null)
  }

  _transform(record, _enc, done) {
    if (!this.years[record.year]) {
      this.years[record.year] = new CrimeYear(record.year)
    }
    this.years[record.year].addCrimes(record.value)
    done()
  }

  _flush(done) {
    this.push(Object.values(this.years).sort(CrimeYear.sortByYear))
    done()
  }
}

class CrimeYear {
  static sortByYear(aCrimeYear, bCrimeYear) {
    return aCrimeYear.year - bCrimeYear.year
  }

  static sortByCrimes(aCrimeYear, bCrimeYear) {
    return aCrimeYear.crimes - bCrimeYear.crimes
  }

  constructor(year) {
    this._year = year
    this._crimes = 0
  }

  get year() {
    return this._year
  }

  get crimes() {
    return this._crimes
  }

  toJSON() {
    return { [this._year]: this._crimes }
  }

  addCrimes(value) {
    this._crimes = Number.parseInt(value, 10) + this._crimes
    return this
  }
}
