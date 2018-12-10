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

export function drawPolylinePath (ctx, points, close = false) {
  if (!ctx || !points.length) return

  points.forEach((point, i) =>
    point && (i === 0 ? ctx.moveTo(...point) : ctx.lineTo(...point)))

  close && ctx.lineTo(...points[0])
}

export function drawPolyline (ctx, points, lineWidth = 2, lineColor = '#000', close = false, dashArray = [10, 0]) {
  if (!ctx || !points.length) return

  drawPolylinePath(ctx, points, close)

  ctx.lineWidth = lineWidth
  ctx.strokeStyle = lineColor
  ctx.setLineDash(dashArray)

  ctx.stroke()
}

export function drawSmoothlinePath (ctx, points, close = false) {
  if (!ctx || !points.length) return

  const pointsNum = points.length

  points.forEach((point, i) => {
    if (i === 0) {

    } if (i === pointsNum - 1) {

    } else {

    }
  })
}

export function getBezierCurveLineControlPoints (pointBefore, pointMiddle, pointAfter) {
  const [offsetA, offsetB] = [6, 6]

  return [
    [
      pointMiddle[0] + offsetA(pointAfter[0] - pointBefore[0]),
      pointMiddle[1] + offsetA(pointAfter[1] - pointBefore[1])
    ],
    [
      (pointAfter[0] - offsetB())
    ]
  ]
}

export function drawSmoothline (ctx, points, lineWidth = 2, lineColor = '#000', close = false, dashArray = [10, 0]) {
  if (!ctx || !points.length) return

  drawSmoothlinePath()
}

export function drawBezierCurveLinePath (ctx, points) {
  if (!ctx || !points.length) return

  points.forEach(point => ctx.bezierCurveTo(...point))
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

const canvas = {
  drawLine,
  drawPolylinePath,
  drawPolyline,
  drawSmoothlinePath,
  drawSmoothline,
  drawPoints
}

export default function (Vue) {
  Vue.prototype.canvas = canvas
}
