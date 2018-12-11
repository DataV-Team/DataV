import { filterNull } from './methodsExtend'

export function drawLine (ctx, lineBegin, lineEnd, lineWidth = 2, lineColor = '#000', dashArray = [10, 0]) {
  if (!ctx || !lineBegin || !lineEnd) return

  ctx.beginPath()

  ctx.moveTo(...lineBegin)
  ctx.lineTo(...lineEnd)

  ctx.closePath()

  ctx.lineWidth = lineWidth
  ctx.strokeStyle = lineColor
  ctx.setLineDash(dashArray)

  ctx.stroke()
}

export function drawPolylinePath (ctx, points, close = false, newPath = false) {
  if (!ctx || !points.length) return

  newPath && ctx.beginPath()

  points.forEach((point, i) =>
    point && (i === 0 ? ctx.moveTo(...point) : ctx.lineTo(...point)))

  close && ctx.lineTo(...points[0])
}

export function drawPolyline (ctx, points, lineWidth = 2, lineColor = '#000', close = false, dashArray = [10, 0], newPath = false) {
  if (!ctx || !points.length) return

  drawPolylinePath(ctx, points, close, newPath)

  ctx.lineWidth = lineWidth
  ctx.strokeStyle = lineColor
  ctx.setLineDash(dashArray)

  ctx.stroke()
}

export function drawSmoothlinePath (ctx, points, close = false, newPath = false, moveTo = false) {
  if (!ctx || points.length < 3) return

  const canDrawPoints = filterNull(points)

  close && canDrawPoints.push(canDrawPoints[0])

  const lastPointIndex = canDrawPoints.length - 1

  newPath && ctx.beginPath()

  moveTo && ctx.moveTo(...canDrawPoints[0])

  canDrawPoints.forEach((t, i) =>
    (i !== lastPointIndex) && drawBezierCurveLinePath(ctx,
      ...getBezierCurveLineControlPoints(canDrawPoints, i, false),
      canDrawPoints[i + 1]))
}

export function getBezierCurveLineControlPoints (points, index, close = false, offsetA = 0.25, offsetB = 0.25) {
  const pointNum = points.length

  if (pointNum < 3 || index >= pointNum) return

  let beforePointIndex = index - 1
  beforePointIndex < 0 && (beforePointIndex = (close ? pointNum + beforePointIndex : 0))

  let afterPointIndex = index + 1
  afterPointIndex >= pointNum && (afterPointIndex = (close ? afterPointIndex - pointNum : pointNum - 1))

  let afterNextPointIndex = index + 2
  afterNextPointIndex >= pointNum && (afterNextPointIndex = (close ? afterNextPointIndex - pointNum : pointNum - 1))

  const pointBefore = points[beforePointIndex]
  const pointMiddle = points[index]
  const pointAfter = points[afterPointIndex]
  const pointAfterNext = points[afterNextPointIndex]

  return [
    [
      pointMiddle[0] + offsetA * (pointAfter[0] - pointBefore[0]),
      pointMiddle[1] + offsetA * (pointAfter[1] - pointBefore[1])
    ],
    [
      pointAfter[0] - offsetB * (pointAfterNext[0] - pointMiddle[0]),
      pointAfter[1] - offsetB * (pointAfterNext[1] - pointMiddle[1])
    ]
  ]
}

export function drawSmoothline (ctx, points, lineWidth = 2, lineColor = '#000', close = false, dashArray = [10, 0], newPath = false, moveTo = false) {
  if (!ctx || points.length < 3) return

  drawSmoothlinePath(ctx, points, close, newPath, moveTo)

  ctx.lineWidth = lineWidth
  ctx.strokeStyle = lineColor
  ctx.setLineDash(dashArray)

  ctx.stroke()
}

export function drawBezierCurveLinePath (ctx, ctlBefore, ctlAfter, end, newPath = false) {
  if (!ctx || !ctlBefore || !ctlAfter || !end) return

  newPath && ctx.beginPath()

  ctx.bezierCurveTo(...ctlBefore, ...ctlAfter, ...end)
}

export function drawPoints (ctx, points, radius = 10, color = '#000') {
  points.forEach(point => {
    if (!point) return

    ctx.beginPath()

    ctx.arc(...point, radius, 0, Math.PI * 2)

    ctx.fillStyle = color

    ctx.fill()
  })
}

export function getLinearGradientColor (ctx, begin, end, color) {
  if (!ctx || !begin || !end || !color.length) return

  let colors = color

  typeof colors === 'string' && (colors = [color, color])

  const linearGradientColor = ctx.createLinearGradient(...begin, ...end)

  const colorGap = 1 / (colors.length - 1)

  colors.forEach((c, i) => linearGradientColor.addColorStop(colorGap * i, c))

  return linearGradientColor
}

const canvas = {
  drawLine,
  drawPolylinePath,
  drawPolyline,
  getBezierCurveLineControlPoints,
  drawSmoothlinePath,
  drawSmoothline,
  drawBezierCurveLinePath,
  drawPoints,
  getLinearGradientColor
}

export default function (Vue) {
  Vue.prototype.canvas = canvas
}
