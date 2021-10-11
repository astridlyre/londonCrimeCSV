export function capitalize(str) {
  return str[0].toUpperCase() + str.substring(1)
}

export function percentageChange(start, end) {
  return ((end - start) / start) * 100
}

export function roundTo(places) {
  const factor = Math.pow(10, places)
  return num => Math.round(num * factor) / factor
}

export function errorExit(err) {
  console.error(err)
  process.exit(1)
}
