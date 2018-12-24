export default {
  data () {
    return {
      defaultAxisLineColor: '#666',
      defaultAxisTagColor: '#666',
      defaultGridLineColor: '#666',
      defaultTagColor: '#666',

      defaultGridLineType: 'line',
      defaultGridLineDash: [5, 5],

      defaultXAxisOffset: 30,
      defaultAxisLineTagGap: 5,
      defaultAxisFontSize: 10,
      defaultAxisFontFamily: 'Arial',

      valueMaxMin: [],
      agValueMaxMin: [],

      valueAxisMaxMin: [],
      agValueAxisMaxMin: [],

      valueAxisTag: [],
      agValueAxisTag: [],

      labelAxisTag: [],
      agLabelAxisTag: [],

      xAxisTagBA: ['', ''],
      agXAxisTagBA: ['', ''],
      yAxisTagBA: ['', ''],
      agYAxisTagBA: ['', ''],

      addBAValueAxisTag: [],
      addBAAGValueAxisTag: [],

      addBALabelAxisTag: [],
      addBAAGLabelAxisTag: [],

      axisUnit: [],

      axisFontSize: 0,
      axisFontFamily: '',

      axisOffset: [],

      axisOriginPos: [],
      axisWH: [],

      axisAnglePos: {},

      valueAxisTagPos: [],
      agValueAxisTagPos: [],

      labelAxisTagPos: [],
      agLabelAxisTagPos: [],

      tagAlign: {}
    }
  },
  methods: {
    initAxis () {
      const { calcValuesMaxMin, calcValueAxisData, calcLabelAxisData } = this

      calcValuesMaxMin()

      calcValueAxisData()

      calcLabelAxisData()

      const { calcTagBA, calcAddBATag, calcAxisUnit } = this

      calcTagBA()

      calcAddBATag()

      calcAxisUnit()

      const { calcAxisFontData, calcAxisOffset, calcAxisAreaData } = this

      calcAxisFontData()

      calcAxisOffset()

      calcAxisAreaData()

      const { calcAxisAnglePos, calcValueAxisTagPos, calcLabelAxisTagPos } = this

      calcAxisAnglePos()

      calcValueAxisTagPos()

      calcLabelAxisTagPos()

      const { calcTagAlign } = this

      calcTagAlign()
    },
    calcValuesMaxMin () {
      const { data: { data }, calcValueMaxMin } = this

      const valueSeries = data.filter(({ againstAxis }) => !againstAxis)

      if (valueSeries.length) this.valueMaxMin = calcValueMaxMin(valueSeries)

      const agValueSeries = data.filter(({ againstAxis }) => againstAxis)

      if (agValueSeries.length) this.agValueMaxMin = calcValueMaxMin(agValueSeries)
    },
    calcValueMaxMin (data) {
      const { mulValueAdd, calcMulValueAdd, getArrayMax, getArrayMin } = this

      let valueSeries = data.map(({ data: td }) => td)

      const min = getArrayMin(valueSeries)

      mulValueAdd && (valueSeries = calcMulValueAdd(valueSeries))

      const max = getArrayMax(valueSeries)

      return [max, min]
    },
    calcMulValueAdd (values) {
      const { multipleSum, filterNull } = this

      return values.map(series =>
        filterNull(series).map(n =>
          n instanceof Array ? multipleSum(...filterNull(n)) : n))
    },
    calcValueAxisData () {
      const { horizon, data: { x, ax, y, ay }, calcValueAxisTag } = this

      const { valueMaxMin, agValueMaxMin, getValueAxisMaxMin } = this

      const valueAxis = horizon ? [x, ax] : [y, ay]

      if (valueMaxMin.length) {
        const valueAxisTag = this.valueAxisTag = calcValueAxisTag(valueMaxMin, valueAxis[0])

        this.valueAxisMaxMin = getValueAxisMaxMin(valueAxisTag)
      }

      if (agValueMaxMin.length) {
        const agValueAxisTag = this.agValueAxisTag = calcValueAxisTag(agValueMaxMin, valueAxis[1])

        this.agValueAxisMaxMin = getValueAxisMaxMin(agValueAxisTag)
      }
    },
    calcValueAxisTag ([vmax, vmin], { max, min, num, fixed, data } = {}) {
      if (data) return data

      let [trueMax, trueMin] = [max, min]

      const thirdValueMinus = parseInt((vmax - vmin) / 3)

      !max && (max !== 0) && (trueMax = vmax + thirdValueMinus)
      !min && (min !== 0) && (trueMin = vmin - thirdValueMinus)

      const trueMinus = trueMax - trueMin

      !num && trueMinus < 9 && (num = trueMinus + 1)
      !num && (num = 10)

      const valueGap = trueMinus / (num - 1)

      return Array(num).fill(0).map((t, i) =>
        (trueMin + i * valueGap).toFixed(fixed))
    },
    getValueAxisMaxMin (valueTag) {
      const lastIndex = valueTag.length - 1

      return [
        parseFloat(valueTag[lastIndex]),
        parseFloat(valueTag[0])
      ]
    },
    calcLabelAxisData () {
      const { horizon, data: { x, ax, y, ay } } = this

      const labelAxis = horizon ? [y, ay] : [x, ax]

      if (labelAxis[0] && labelAxis[0].data) this.labelAxisTag = labelAxis[0].data

      if (labelAxis[1] && labelAxis[1].data) this.agLabelAxisTag = labelAxis[1].data
    },
    calcTagBA () {
      const { data: { x, ax, y, ay } } = this

      if (x && x.tagBefore) this.xAxisTagBA[0] = x.tagBefore
      if (ax && ax.tagBefore) this.agXAxisTagBA[0] = ax.tagBefore
      if (y && y.tagBefore) this.yAxisTagBA[0] = y.tagBefore
      if (ay && ay.tagBefore) this.agYAxisTagBA[0] = ay.tagBefore

      if (x && x.tagAfter) this.xAxisTagBA[1] = x.tagAfter
      if (ax && ax.tagAfter) this.agXAxisTagBA[1] = ax.tagAfter
      if (y && y.tagAfter) this.yAxisTagBA[1] = y.tagAfter
      if (ay && ay.tagAfter) this.agYAxisTagBA[1] = ay.tagAfter
    },
    calcAddBATag () {
      const { xAxisTagBA, agXAxisTagBA, yAxisTagBA, agYAxisTagBA } = this

      const { valueAxisTag, agValueAxisTag, labelAxisTag, agLabelAxisTag } = this

      const { horizon, addBATag } = this

      const valueTagBA = horizon ? [xAxisTagBA, agXAxisTagBA] : [yAxisTagBA, agYAxisTagBA]

      const labelTagBA = horizon ? [yAxisTagBA, agYAxisTagBA] : [xAxisTagBA, agXAxisTagBA]

      if (valueAxisTag.length) this.addBAValueAxisTag = addBATag(valueAxisTag, valueTagBA[0])
      if (agValueAxisTag.length) this.addBAAGValueAxisTag = addBATag(agValueAxisTag, valueTagBA[1])
      if (labelAxisTag.length) this.addBALabelAxisTag = addBATag(labelAxisTag, labelTagBA[0])
      if (agLabelAxisTag.length) this.addBAAGLabelAxisTag = addBATag(agLabelAxisTag, labelTagBA[1])
    },
    addBATag (tags, ba) {
      return tags.map(tag => tag ? `${ba[0]}${tag}${ba[1]}` : tag)
    },
    calcAxisUnit () {
      const { data: { x, ax, y, ay } } = this

      if (x && x.unit) this.axisUnit[0] = x.unit
      if (ax && ax.unit) this.axisUnit[1] = ax.unit
      if (y && y.unit) this.axisUnit[2] = y.unit
      if (ay && ay.unit) this.axisUnit[3] = ay.unit
    },
    calcAxisFontData () {
      const { defaultAxisFontSize, defaultAxisFontFamily } = this

      const { data: { axisFontSize, axisFontFamily } } = this

      this.axisFontSize = axisFontSize || defaultAxisFontSize

      this.axisFontFamily = axisFontFamily || defaultAxisFontFamily
    },
    calcAxisOffset () {
      const { horizon, axisUnit, defaultXAxisOffset } = this

      const { addBAValueAxisTag, addBAAGValueAxisTag, addBALabelAxisTag, addBAAGLabelAxisTag } = this

      const { axisFontSize, axisFontFamily, defaultAxisLineTagGap } = this

      const { data: { x, ax, y, ay } } = this

      const { ctx, canvas: { getTextsWidth }, boundaryGap } = this

      ctx.font = `${axisFontSize}px ${axisFontFamily}`

      this.axisOffset[0] = (ax && ax.offset) || defaultXAxisOffset
      this.axisOffset[2] = (x && x.offset) || defaultXAxisOffset

      const horizonAxisTags = horizon
        ? [addBALabelAxisTag, addBAAGLabelAxisTag]
        : [addBAValueAxisTag, addBAAGValueAxisTag]

      this.axisOffset[3] = (y && y.offset) ||
        Math.max(...getTextsWidth(ctx, [axisUnit[2] || '']),
          ...getTextsWidth(ctx, horizonAxisTags[0].length ? horizonAxisTags[0] : 0)) + defaultAxisLineTagGap

      // axis offset 1
      const xAxisTags = horizon ? addBAValueAxisTag : addBALabelAxisTag

      let xAxisTagsHalfWidth = 0

      xAxisTags.length && (xAxisTagsHalfWidth = ctx.measureText(xAxisTags.length - 1).width / 2)

      let rightOffset = Math.max(...getTextsWidth(ctx, [axisUnit[3] || '']),
        ...getTextsWidth(ctx, [axisUnit[0] || '']),
        ...getTextsWidth(ctx, horizonAxisTags[1].length ? horizonAxisTags[1] : [''])) + defaultAxisLineTagGap

      !boundaryGap && (rightOffset += xAxisTagsHalfWidth)

      this.axisOffset[1] = (ay && ay.offset) || rightOffset

      if (y && y.noTag) this.axisOffset[3] = 1
      if (ay && ay.noTag) this.axisOffset[1] = 1
    },
    calcAxisAreaData () {
      const { canvasWH, axisOffset, axisWH, axisOriginPos } = this

      axisWH[0] = canvasWH[0] - axisOffset[1] - axisOffset[3]
      axisWH[1] = canvasWH[1] - axisOffset[0] - axisOffset[2]

      axisOriginPos[0] = axisOffset[3]
      axisOriginPos[1] = axisWH[1] + axisOffset[0]
    },
    calcAxisAnglePos () {
      const { axisWH, axisOriginPos, axisAnglePos } = this

      axisAnglePos.leftTop = [axisOriginPos[0], axisOriginPos[1] - axisWH[1]]
      axisAnglePos.rightTop = [axisOriginPos[0] + axisWH[0], axisOriginPos[1] - axisWH[1]]

      axisAnglePos.leftBottom = axisOriginPos
      axisAnglePos.rightBottom = [axisOriginPos[0] + axisWH[0], axisOriginPos[1]]
    },
    calcValueAxisTagPos () {
      const { horizon, axisOriginPos, axisAnglePos } = this

      const { valueAxisTag, agValueAxisTag, getValueAxisTagPos } = this

      if (valueAxisTag) this.valueAxisTagPos = getValueAxisTagPos(valueAxisTag, axisOriginPos)

      const basePoint = horizon ? axisAnglePos.leftTop : axisAnglePos.rightBottom

      if (agValueAxisTag) this.agValueAxisTagPos = getValueAxisTagPos(agValueAxisTag, basePoint)
    },
    getValueAxisTagPos (tags, [x, y]) {
      const { horizon, axisWH } = this

      const tagsNum = tags.length

      const areaLength = horizon ? axisWH[0] : axisWH[1]

      const tagGap = areaLength / (tagsNum - 1)

      return new Array(tagsNum).fill(0).map((t, i) =>
        horizon ? [x + tagGap * i, y] : [x, y - tagGap * i])
    },
    calcLabelAxisTagPos () {
      const { horizon, getLabelAxisTagPos, axisAnglePos } = this

      const { labelAxisTag, agLabelAxisTag, axisOriginPos } = this

      if (labelAxisTag.length) this.labelAxisTagPos = getLabelAxisTagPos(labelAxisTag, axisOriginPos)

      const basePoint = horizon ? axisAnglePos.rightBottom : axisAnglePos.leftTop

      if (agLabelAxisTag.length) this.agLabelAxisTagPos = getLabelAxisTagPos(agLabelAxisTag, basePoint)
    },
    getLabelAxisTagPos (tags, [x, y]) {
      const { horizon, axisWH, boundaryGap } = this

      const tagsNum = tags.length

      const areaLength = horizon ? axisWH[1] : axisWH[0]

      const tagGap = areaLength / (boundaryGap ? tagsNum : tagsNum - 1)

      const halfGap = tagGap / 2

      const tempPos = new Array(tagsNum).fill(0)

      if (boundaryGap) {
        return tempPos.map((t, i) =>
          horizon ? [x, y - (tagGap * i) - halfGap] : [x + (tagGap * i) + halfGap, y])
      }

      if (!boundaryGap) {
        return tempPos.map((t, i) =>
          horizon ? [x, y + tagGap * i] : [x + tagGap * i, y])
      }
    },
    calcTagAlign () {
      const { tagAlign } = this

      tagAlign.x = ['center', 'top']
      tagAlign.y = ['right', 'middle']
      tagAlign.ax = ['center', 'bottom']
      tagAlign.ay = ['left', 'middle']
    },
    drawAxis () {
      const { drawAxisLine, drawAxisTag, drawAxisUnit } = this

      drawAxisLine()

      drawAxisTag()

      drawAxisUnit()

      const { drawAxisGrid } = this

      drawAxisGrid()
    },
    drawAxisLine () {
      const { ctx, horizon, axisOriginPos, axisAnglePos } = this

      const { defaultAxisLineColor, agValueAxisTag, agLabelAxisTag } = this

      const { data: { x, ax, y, ay } } = this

      ctx.lineWidth = 1

      if (!x || !x.noAxisLine) {
        ctx.strokeStyle = (x && x.axisLineColor) || defaultAxisLineColor
        ctx.beginPath()
        ctx.moveTo(...axisOriginPos)
        ctx.lineTo(...axisAnglePos.rightBottom)
        ctx.stroke()
      }

      if (!y || !y.noAxisLine) {
        ctx.strokeStyle = (y && y.axisLineColor) || defaultAxisLineColor
        ctx.beginPath()
        ctx.moveTo(...axisOriginPos)
        ctx.lineTo(...axisAnglePos.leftTop)
        ctx.stroke()
      }

      const agValueAxis = horizon ? ay : ax

      if (agValueAxisTag.length && (!agValueAxis || !agValueAxis.noAxisLine)) {
        ctx.strokeStyle = (agValueAxis && agValueAxis.axisLineColor) || defaultAxisLineColor
        ctx.beginPath()
        ctx.moveTo(...(horizon ? axisAnglePos.leftTop : axisAnglePos.rightTop))
        ctx.lineTo(...(horizon ? axisAnglePos.rightTop : axisAnglePos.rightBottom))
        ctx.stroke()
      }

      const agLebalAxis = horizon ? ax : ay

      if (agLabelAxisTag.length && (!agLebalAxis || !agLebalAxis.noAxisLine)) {
        ctx.strokeStyle = (agLebalAxis && agLebalAxis.axisLineColor) || defaultAxisLineColor
        ctx.beginPath()
        ctx.moveTo(...(horizon ? axisAnglePos.rightTop : axisAnglePos.leftTop))
        ctx.lineTo(...(horizon ? axisAnglePos.rightBottom : axisAnglePos.rightTop))
        ctx.stroke()
      }
    },
    drawAxisTag () {
      const { horizon, tagAlign, defaultAxisLineTagGap: offset } = this

      const { data: { x, ax, y, ay }, drawAxisSeriesTag } = this

      const xAxis = horizon ? ['addBAValueAxisTag', 'valueAxisTagPos'] : ['addBALabelAxisTag', 'labelAxisTagPos']
      const yAxis = horizon ? ['addBALabelAxisTag', 'labelAxisTagPos'] : ['addBAValueAxisTag', 'valueAxisTagPos']
      const agXAxis = horizon ? ['addBAAGValueAxisTag', 'agValueAxisTagPos'] : ['addBAAGLabelAxisTag', 'agLabelAxisTagPos']
      const agYAxis = horizon ? ['addBAAGLabelAxisTag', 'agLabelAxisTagPos'] : ['addBAAGValueAxisTag', 'agValueAxisTagPos']

      if (!x || !x.noAxisTag) drawAxisSeriesTag(...xAxis.map(td => this[td]), x, tagAlign.x, [0, offset], x && x.rotate)
      if (!y || !y.noAxisTag) drawAxisSeriesTag(...yAxis.map(td => this[td]), y, tagAlign.y, [-offset, 0])
      if (!ax || !ax.noAxisTag) drawAxisSeriesTag(...agXAxis.map(td => this[td]), ax, tagAlign.ax, [0, -offset])
      if (!ay || !ay.noAxisTag) drawAxisSeriesTag(...agYAxis.map(td => this[td]), ay, tagAlign.ay, [offset, 0])
    },
    drawAxisSeriesTag (tags, tagPos, { fontSize, fontFamily, tagColor } = {}, align, offset, rotate = false) {
      const { ctx, defaultAxisFontSize, defaultAxisFontFamily, defaultTagColor, drawColors } = this

      let color = tagColor || defaultTagColor

      color === 'colors' && (color = drawColors)

      const colorNum = color.length

      const mulColor = color instanceof Array

      ctx.font = `${fontSize || defaultAxisFontSize}px ${fontFamily || defaultAxisFontFamily}`

      !mulColor && (ctx.fillStyle = color)

      ctx.textAlign = align[0]
      ctx.textBaseline = align[1]

      tags.forEach((tag, i) => {
        if (!tag && tag !== 0) return

        const currentPos = [tagPos[i][0] + offset[0], tagPos[i][1] + offset[1]]

        mulColor && (ctx.fillStyle = color[i % colorNum])

        if (rotate) {
          ctx.textAlign = 'left'
          ctx.textBaseline = 'top'

          ctx.save()
          ctx.translate(...currentPos)
          ctx.rotate(Math.PI / 4)
        }

        ctx.fillText(tag, ...(rotate ? [0, 0] : currentPos))

        if (rotate) ctx.restore()
      })
    },
    drawAxisUnit () {
      const { axisOriginPos, canvasWH, drawUnit, defaultAxisLineTagGap } = this

      const { data: { x, ax, y, ay }, axisAnglePos } = this

      if (x) {
        const pos = [canvasWH[0], axisOriginPos[1] + defaultAxisLineTagGap]
        drawUnit(x, pos, ['right', 'top'])
      }

      if (ax) {
        const pos = [canvasWH[0], axisAnglePos.rightTop[1] - defaultAxisLineTagGap]
        drawUnit(ax, pos, ['right', 'bottom'])
      }

      if (y) {
        const pos = [axisOriginPos[0] - defaultAxisLineTagGap, 0]
        drawUnit(y, pos, ['right', 'top'])
      }

      if (ay) {
        const pos = [axisAnglePos.rightTop[0] + defaultAxisLineTagGap, 0]
        drawUnit(ay, pos, ['left', 'top'])
      }
    },
    drawUnit ({ unit, unitColor, fontSize, fontFamily }, pos, align) {
      const { defaultTagColor, defaultAxisFontSize, defaultAxisFontFamily } = this

      const { ctx } = this

      if (!unit) return

      ctx.font = `${fontSize || defaultAxisFontSize}px ${fontFamily || defaultAxisFontFamily}`

      ctx.fillStyle = unitColor || defaultTagColor

      ctx.textAlign = align[0]
      ctx.textBaseline = align[1]

      ctx.fillText(unit, ...pos)
    },
    drawAxisGrid () {
      const { valueAxisTagPos, agValueAxisTagPos, labelAxisTagPos, agLabelAxisTagPos } = this

      const { valueAxisTag, agValueAxisTag, labelAxisTag, agLabelAxisTag } = this

      const { data: { x, ax, y, ay }, horizon, drawGrid, boundaryGap } = this

      const xAxis = horizon ? [valueAxisTag, valueAxisTagPos] : [labelAxisTag, labelAxisTagPos]

      let xLLLineStatus = [false, false]

      if (horizon) {
        xLLLineStatus = [true, false]
      } else {
        xLLLineStatus = boundaryGap ? [false, false] : [true, true]
      }

      if (xAxis[0].length) drawGrid(x, ...xAxis, false, false, true, ...xLLLineStatus)

      const yAxis = horizon ? [labelAxisTag, labelAxisTagPos] : [valueAxisTag, valueAxisTagPos]

      if (yAxis[0].length) drawGrid(y, ...yAxis, true, true, false, !horizon)

      const agXAxis = horizon ? [agValueAxisTag, agValueAxisTagPos] : [agLabelAxisTag, agLabelAxisTagPos]

      if (agXAxis[0].length) drawGrid(ax, ...agXAxis, false, false, false, ...(boundaryGap ? [false, false] : [true, true]))

      const agYAxis = horizon ? [agLabelAxisTag, agLabelAxisTagPos] : [agValueAxisTag, agValueAxisTagPos]

      if (agYAxis[0].length) drawGrid(ay, ...agYAxis, true, false, false, true)
    },
    drawGrid (axis = {}, gridTag, gridPos, horizon = true, right = true, top = true, noFirst = false, noLast = false) {
      const { grid, gridLineColor, gridLineType, gridLineDash } = axis

      if (!grid) return

      const { defaultGridLineType, defaultGridLineColor, defaultGridLineDash } = this

      const { ctx, drawColors, axisWH } = this

      const trueGridLineType = gridLineType || defaultGridLineType
      const trueGridLineDash = trueGridLineType === 'dashed' ? (gridLineDash || defaultGridLineDash) : [10, 0]

      ctx.setLineDash(trueGridLineDash)

      let color = gridLineColor || defaultGridLineColor

      color === 'colors' && (color = drawColors)

      const mulColor = color instanceof Array

      const colorNum = color.length

      !mulColor && (ctx.strokeStyle = color)

      ctx.lineWidth = 1

      const gridLastIndex = gridPos.length - 1

      gridPos.forEach((pos, i) => {
        if (!gridTag[i] && gridTag[i] !== 0) return

        if (i === 0 && noFirst) return

        if (i === gridLastIndex && noLast) return

        ctx.beginPath()

        mulColor && (ctx.strokeStyle = color[i % colorNum])

        ctx.moveTo(...pos)
        ctx.lineTo(...(horizon
          ? [right ? pos[0] + axisWH[0] : pos[0] - axisWH[0], pos[1]]
          : [pos[0], top ? pos[1] - axisWH[1] : pos[1] + axisWH[1]]))

        ctx.stroke()
      })
    }
  }
}
