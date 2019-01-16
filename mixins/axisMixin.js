export default {
  data () {
    return {
      // config able
      defaultAxisFontSize: 10,
      defaultAxisFontFamily: 'Arial',

      defaultAxisLineColor: '#666',
      defaultGridLineColor: '#666',
      defaultAxisTagColor: '#666',
      defaultAxisUnitColor: '#666',

      defaultGridLineDash: [2, 2],

      defaultNoAxisLine: false,
      defaultNoAxisTag: false,

      defaultXAxisOffset: 20,
      defaultAxisLineTagGap: 5,

      // after merge
      axisFontSize: 0,
      axisFontFamily: '',

      axisLineColor: '',
      gridLineColor: '',
      axisTagColor: '',
      axisUnitColor: '',

      gridLineDash: [],

      noAxisLine: '',
      noAxisTag: '',

      // calc data
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

      const { calcAxisFontData, calcAxisColor, calcGridLineDash } = this

      calcAxisFontData()

      calcAxisColor()

      calcGridLineDash()

      const { calcAxisLineTagStatus, calcAxisOffset, calcAxisAreaData } = this

      calcAxisLineTagStatus()

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
      const { data: { series }, calcValueMaxMin } = this

      const valueSeries = series.filter(({ againstAxis }) => !againstAxis)

      if (valueSeries.length) this.valueMaxMin = calcValueMaxMin(valueSeries)

      const agValueSeries = series.filter(({ againstAxis }) => againstAxis)

      if (agValueSeries.length) this.agValueMaxMin = calcValueMaxMin(agValueSeries)
    },
    calcValueMaxMin (series) {
      const { mulValueAdd, calcMulValueAdd, getArrayMax, getArrayMin } = this

      let valueSeries = series.map(({ value }) => value)

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
    calcValueAxisTag ([vmax, vmin], { max, min, num, fixed, tags } = {}) {
      if (tags) return tags

      let [trueMax, trueMin] = [max, min]

      if (vmax === 0 && vmin === 0) vmax = 8

      const thirdValueMinus = parseInt((vmax - vmin) / 3)

      !max && (max !== 0) && (trueMax = vmax + thirdValueMinus)
      !min && (min !== 0) && (trueMin = vmin - thirdValueMinus)

      const trueMinus = trueMax - trueMin

      !num && trueMinus < 9 && (num = Math.ceil(trueMinus) + 1)
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

      if (labelAxis[0] && labelAxis[0].tags) this.labelAxisTag = labelAxis[0].tags

      if (labelAxis[1] && labelAxis[1].tags) this.agLabelAxisTag = labelAxis[1].tags
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
      const { defaultAxisFontSize, defaultAxisFontFamily, data } = this

      const { fontSize, fontFamily, axisFontSize, axisFontFamily }= data

      this.axisFontSize = axisFontSize || fontSize || defaultAxisFontSize

      this.axisFontFamily = axisFontFamily || fontFamily || defaultAxisFontFamily
    },
    calcAxisColor () {
      const { data, defaultAxisTagColor, defaultAxisLineColor, defaultGridLineColor } = this

      const { axisTagColor, axisLineColor, gridLineColor } = data

      this.axisTagColor = axisTagColor || defaultAxisTagColor

      this.axisLineColor = axisLineColor || defaultAxisLineColor

      this.gridLineColor = gridLineColor || defaultGridLineColor
    },
    calcGridLineDash () {
      const { data, defaultGridLineDash } = this

      const { gridLineDash } = data

      if (gridLineDash instanceof Array) {
        this.gridLineDash = gridLineDash
      } else if (gridLineDash) {
        this.gridLineDash = defaultGridLineDash
      } else {
        this.gridLineDash = [10, 0]
      }
    },
    calcAxisLineTagStatus () {
      const { defaultNoAxisLine, defaultNoAxisTag, data } = this

      const { noAxisLine, noAxisTag } = data

      this.noAxisLine = noAxisLine || defaultNoAxisLine

      this.noAxisTag = noAxisTag || defaultNoAxisTag
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

      ;(!boundaryGap || horizon) && (rightOffset += (xAxisTagsHalfWidth + 5))

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

      let gapColumnNum = boundaryGap ? tagsNum : tagsNum - 1

      gapColumnNum === 0 && (gapColumnNum = 1)

      const tagGap = areaLength / gapColumnNum

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
      const { noAxisLine } = this

      if (noAxisLine) return

      const { ctx, horizon, axisOriginPos, axisAnglePos } = this

      const { axisLineColor, agValueAxisTag, agLabelAxisTag } = this

      const { data: { x, ax, y, ay } } = this

      ctx.lineWidth = 1

      if (!x || !x.noAxisLine) {
        ctx.strokeStyle = (x && x.axisLineColor) || axisLineColor
        ctx.beginPath()
        ctx.moveTo(...axisOriginPos)
        ctx.lineTo(...axisAnglePos.rightBottom)
        ctx.stroke()
      }

      if (!y || !y.noAxisLine) {
        ctx.strokeStyle = (y && y.axisLineColor) || axisLineColor
        ctx.beginPath()
        ctx.moveTo(...axisOriginPos)
        ctx.lineTo(...axisAnglePos.leftTop)
        ctx.stroke()
      }

      const agValueAxis = horizon ? ay : ax

      if (agValueAxisTag.length && (!agValueAxis || !agValueAxis.noAxisLine)) {
        ctx.strokeStyle = (agValueAxis && agValueAxis.axisLineColor) || axisLineColor
        ctx.beginPath()
        ctx.moveTo(...(horizon ? axisAnglePos.leftTop : axisAnglePos.rightTop))
        ctx.lineTo(...(horizon ? axisAnglePos.rightTop : axisAnglePos.rightBottom))
        ctx.stroke()
      }

      const agLebalAxis = horizon ? ax : ay

      if (agLabelAxisTag.length && (!agLebalAxis || !agLebalAxis.noAxisLine)) {
        ctx.strokeStyle = (agLebalAxis && agLebalAxis.axisLineColor) || axisLineColor
        ctx.beginPath()
        ctx.moveTo(...(horizon ? axisAnglePos.rightTop : axisAnglePos.leftTop))
        ctx.lineTo(...(horizon ? axisAnglePos.rightBottom : axisAnglePos.rightTop))
        ctx.stroke()
      }
    },
    drawAxisTag () {
      const { noAxisTag } = this

      if (noAxisTag) return

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
      const { ctx, axisFontSize, axisFontFamily, axisTagColor, drawColors } = this

      let color = tagColor || axisTagColor

      color === 'colors' && (color = drawColors)

      const colorNum = color.length

      const mulColor = color instanceof Array

      ctx.font = `${fontSize || axisFontSize}px ${fontFamily || axisFontFamily}`

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
          ctx.rotate(rotate * Math.PI / 180)
        }

        ctx.fillText(tag, ...(rotate ? [0, 0] : currentPos))

        if (rotate) ctx.restore()
      })
    },
    drawAxisUnit () {
      const { noAxisTag } = this

      if (noAxisTag) return

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
      const { axisTagColor, axisFontSize, axisFontFamily } = this

      const { ctx } = this

      if (!unit) return

      ctx.font = `${fontSize || axisFontSize}px ${fontFamily || axisFontFamily}`

      ctx.fillStyle = unitColor || axisTagColor

      ctx.textAlign = align[0]
      ctx.textBaseline = align[1]

      ctx.fillText(unit, ...pos)
    },
    drawAxisGrid () {
      const { valueAxisTagPos, agValueAxisTagPos, labelAxisTagPos, agLabelAxisTagPos } = this

      const { valueAxisTag, agValueAxisTag, labelAxisTag, agLabelAxisTag } = this

      const { data: { x, ax, y, ay }, horizon, drawGrid, boundaryGap } = this

      const xAxis = horizon ? [valueAxisTag, valueAxisTagPos] : [labelAxisTag, labelAxisTagPos]

      let xBELineStatus = [false, false]

      if (horizon) {
        xBELineStatus = [true, false]
      } else {
        xBELineStatus = boundaryGap ? [false, false] : [true, true]
      }

      if (xAxis[0].length) drawGrid(x, ...xAxis, false, false, true, ...xBELineStatus)

      const yAxis = horizon ? [labelAxisTag, labelAxisTagPos] : [valueAxisTag, valueAxisTagPos]

      if (yAxis[0].length) drawGrid(y, ...yAxis, true, true, false, !horizon)

      const agXAxis = horizon ? [agValueAxisTag, agValueAxisTagPos] : [agLabelAxisTag, agLabelAxisTagPos]

      if (agXAxis[0].length) drawGrid(ax, ...agXAxis, false, false, false, ...(boundaryGap ? [false, false] : [true, true]))

      const agYAxis = horizon ? [agLabelAxisTag, agLabelAxisTagPos] : [agValueAxisTag, agValueAxisTagPos]

      if (agYAxis[0].length) drawGrid(ay, ...agYAxis, true, false, false, true)
    },
    drawGrid (axis = {}, gridTag, gridPos, horizon = true, right = true, top = true, noFirst = false, noLast = false) {
      const { grid, gridLineColor: cGLC, gridLineDash: cGLD } = axis

      if (!grid) return

      const { gridLineColor, gridLineDash, defaultGridLineDash } = this

      const { ctx, drawColors, axisWH } = this

      let trueGridLineDash = gridLineDash

      if (cGLD instanceof Array) {
        trueGridLineDash = cGLD
      } else if (cGLD === true) {
        trueGridLineDash = defaultGridLineDash
      }

      ctx.setLineDash(trueGridLineDash)

      let color = cGLC || gridLineColor

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
