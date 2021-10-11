import { Transform } from 'stream'
import { capitalize } from './functions.js'

export class CrimeAreaResults extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true })
  }

  _transform(record, _enc, done) {
    this.results = {
      mostCommonCrimes: record.mostCommonCrimeByAreas(),
      leastCommonCrimes: record.leastCommonCrimeByAreas(),
      mostDangerousArea: record.mostDangerousArea(),
    }
    done()
  }

  _flush(done) {
    this.push(this.results || {})
    done()
  }
}

export class TallyCrimeAreas extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true })
    this.areas = new CrimeArea()
  }

  _transform(record, _enc, done) {
    this.areas.addCrime(record.borough, record.major_category, record.value)
    done()
  }

  _flush(done) {
    this.push(this.areas)
    done()
  }
}

class CrimeArea {
  constructor() {
    this._keys = Object.create(null)
    this._areas = Object.create(null)
    this._totals = Object.create(null)
  }

  createKey(name) {
    if (this._keys[name]) return this._keys[name]
    const [first, ...rest] = name.split(' ')
    return (this._keys[name] = [first.toLowerCase()]
      .concat(rest.map(capitalize))
      .join(''))
  }

  addCrime(borough, crime, value) {
    const areaKey = this.createKey(borough)
    const crimeKey = this.createKey(crime)
    if (!this._areas[areaKey]) {
      this._areas[areaKey] = Object.create(null)
    }
    const storedValue = this._areas[areaKey][crimeKey] || 0
    const storedTotal = this._totals[areaKey] || 0
    const newValue = Number.parseInt(value, 10)
    this._areas[areaKey][crimeKey] = storedValue + newValue
    this._totals[areaKey] = storedTotal + newValue
    return this
  }

  mostCommonCrimeByArea(boroughKey) {
    return Object.fromEntries([
      Object.entries(this._areas[boroughKey]).reduce((currentTop, candidate) =>
        candidate[1] > currentTop[1] ? candidate : currentTop
      ),
    ])
  }

  leastCommonCrimeByArea(boroughKey) {
    return Object.fromEntries([
      Object.entries(this._areas[boroughKey]).reduce((currentBottom, candidate) =>
        candidate[1] < currentBottom[1] ? candidate : currentBottom
      ),
    ])
  }

  mostCommonCrimeByAreas() {
    return this.areas.reduce(
      (result, area) => ((result[area] = this.mostCommonCrimeByArea(area)), result),
      {}
    )
  }

  leastCommonCrimeByAreas() {
    return this.areas.reduce(
      (result, area) => ((result[area] = this.leastCommonCrimeByArea(area)), result),
      {}
    )
  }

  mostDangerousArea() {
    const area = Object.entries(this._totals).reduce((currentTop, candidate) =>
      candidate[1] > currentTop[1] ? candidate : currentTop
    )
    return {
      name: area[0],
      crimes: area[1],
    }
  }

  get areas() {
    return Object.keys(this._areas)
  }
}
