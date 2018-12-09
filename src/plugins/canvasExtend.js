export function drawLine (ctx, lineBegin, lineEnd, lineWidth = 2, lineColor = '#000', dashArray = [10, 10]) {
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

export function drawPolyline (ctx, points, lineWidth = 2, lineColor = '#000', close = false, dashArray = [10, 0]) {
  if (!ctx || !points.length) return

  ctx.beginPath()

  points.forEach((point, i) => i === 0 ? ctx.moveTo(...point) : ctx.lineTo(...point))

  close && ctx.lineTo(...points[0])

  ctx.lineWidth = lineWidth
  ctx.strokeStyle = lineColor
  ctx.setLineDash(dashArray)

  ctx.stroke()
}

const canvas = {
  drawLine,
  drawPolyline
}

export default function (Vue) {
  Vue.prototype.canvas = canvas
}
