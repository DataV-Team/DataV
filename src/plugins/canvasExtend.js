export function drawLine (ctx, lineBegin, lineEnd, lineWidth = 2, lineColor = '#000') {
  if (!ctx || !lineBegin || !lineEnd) return

  ctx.beginPath()

  ctx.moveTo(...lineBegin)
  ctx.lineTo(...lineEnd)

  ctx.closePath()

  ctx.lineWidth = lineWidth
  ctx.strokeStyle = lineColor

  ctx.stroke()
}

const canvas = {
  drawLine
}

export default function (Vue) {
  Vue.prototype.canvas = canvas
}
