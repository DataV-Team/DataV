const { parse, stringify } = JSON

export function deepClone (object) {
  return parse(stringify(object))
}

export function deleteArrayAllItems (arrays) {
  arrays.forEach(element => element.splice(0, element.length))
}

export function debounce (delay, callback) {
  let lastTime

  return function () {
    clearTimeout(lastTime)

    const [that, args] = [this, arguments]

    lastTime = setTimeout(() => {
      callback.apply(that, args)
    }, delay)
  }
}

export function randomExtend (minNum, maxNum) {
  if (arguments.length === 1) {
    return parseInt(Math.random() * minNum + 1, 10)
  } else {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
  }
}

export function multipleSum (...num) {
  let sum = 0

  num.forEach(n => (sum += n))

  return sum
}

export function filterNull (arr) {
  const tmpArr = []

  arr.forEach(v => ((v || v === 0) && tmpArr.push(v)))

  return tmpArr
}

export function getPointDistance (pointOne, pointTwo) {
  const minusX = Math.abs(pointOne[0] - pointTwo[0])

  const minusY = Math.abs(pointOne[1] - pointTwo[1])

  return Math.sqrt(minusX * minusX + minusY * minusY)
}

export function getPointToLineDistance (point, linePointOne, linePointTwo) {
  const a = getPointDistance(point, linePointOne)
  const b = getPointDistance(point, linePointTwo)
  const c = getPointDistance(linePointOne, linePointTwo)

  return 0.5 * Math.sqrt((a + b + c) * (a + b - c) * (a + c - b) * (b + c - a)) / c
}

export function getArrayMaxMin (array) {
  if (!array) return false

  return [getArrayMax(array), getArrayMin(array)]
}

export function getArrayMax (array) {
  if (!array) return false

  return Math.max(...filterNull(array).map(n =>
    n instanceof Array ? getArrayMax(n) : n))
}

export function getArrayMin (array) {
  if (!array) return false

  return Math.min(...filterNull(array).map(n =>
    n instanceof Array ? getArrayMin(n) : n))
}

export function getAxisPointsPos ([max, min], value, axisOriginPos, axisWH, tagPos, horizon) {
  const minus = max - min

  const percent = (value - min) / minus

  const length = percent * (horizon ? axisWH[0] : axisWH[1])

  return horizon ? [
    axisOriginPos[0] + length,
    tagPos[1]
  ] : [
    tagPos[0],
    axisOriginPos[1] - length
  ]
}

export default function (Vue) {
  Vue.prototype.deepClone = deepClone
  Vue.prototype.deleteArrayAllItems = deleteArrayAllItems
  Vue.prototype.debounce = debounce
  Vue.prototype.multipleSum = multipleSum
  Vue.prototype.randomExtend = randomExtend
  Vue.prototype.filterNull = filterNull
  Vue.prototype.getPointDistance = getPointDistance
  Vue.prototype.getPointToLineDistance = getPointToLineDistance
  Vue.prototype.getArrayMaxMin = getArrayMaxMin
  Vue.prototype.getArrayMax = getArrayMax
  Vue.prototype.getArrayMin = getArrayMin
  Vue.prototype.getAxisPointsPos = getAxisPointsPos
}
