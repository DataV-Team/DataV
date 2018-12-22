export default {
  data () {
    return {
      defaultAxisLineColor: '#333',
      defaultAxisTagColor: '#333',
      defaultGridLineColor: '#333',
      defaultTagColor: '#333',

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

      tagAlign: {},

      xGridConfig: '',
      agXGridConfig: '',
      yGridConfig: '',
      agYGridConfig: ''
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

      const { calcTagAlign, calcGridConfig } = this

      calcTagAlign()

      calcGridConfig()
    },
    calcValuesMaxMin () {
      const { data: { data }, calcValueMaxMin } = this

      const valueSeries = data.filter(({ againstAxis }) => !againstAxis)

      if (valueSeries.length) this.valueMaxMin = calcValueMaxMin(valueSeries)

      const agValueSeries = data.filter(({ againstAxis }) => againstAxis)

      if (agValueSeries.length) this.agValueMaxMin = calcValueMaxMin(agValueSeries)
    },
    calcValueMaxMin (data) {
      const { mulValueAdd, calcMulValueAdd, getArrayMaxMin } = this

      let valueSeries = data.map(({ data: td }) => td)

      mulValueAdd && (valueSeries = calcMulValueAdd(valueSeries))

      return getArrayMaxMin(valueSeries)
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
    calcValueAxisTag ([vmax, vmin], { max, min, num, fixed } = {}) {
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
        ...getTextsWidth(ctx, horizonAxisTags[1].length ? horizonAxisTags[1] : 0)) + defaultAxisLineTagGap

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
          horizon ? [x, y + (tagGap * i) + halfGap] : [x + (tagGap * i) + halfGap, y])
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
      tagAlign.ax = ['left', 'middle']
      tagAlign.ay = ['left', 'center']
    },
    calcGridConfig () {
      const { data: { x, ax, y, ay } } = this

      const { getGridConfig } = this

      if (x && x.grid) this.xGridConfig = getGridConfig(x)
      if (ax && ax.grid) this.agXGridConfig = getGridConfig(ax)
      if (y && y.grid) this.yGridConfig = getGridConfig(y)
      if (ay && ay.grid) this.agYGridConfig = getGridConfig(ay)
    },
    getGridConfig ({ gridLineType, gridLineDash, gridLineColor }) {
      const { defaultGridLineDash, defaultGridLineType, defaultGridLineColor } = this

      const dash = gridLineDash || defaultGridLineDash

      const config = {
        color: gridLineColor || defaultGridLineColor,
        dash: gridLineType || defaultGridLineType,
        mulColor: false
      }

      config.dash === 'dashed' && (config.dash = dash)
      config.dash !== 'dashed' && (config.dash = [10, 0])

      config.color instanceof Array && (config.mulColor = true)

      return config
    },
    drawAxis () {
      const { drawAxisLine, drawAxisTag, drawUnit } = this

      drawAxisLine()

      drawAxisTag()

      drawUnit()

      const { drawGrid } = this

      drawGrid()
    },
    drawAxisLine () {
      const { ctx, horizon, axisOriginPos, axisAnglePos } = this

      const { defaultAxisLineColor, agValueAxisTag, agLabelAxisTag } = this

      const { data: { x, ax, y, ay } } = this

      ctx.lineWidth = 1

      if (!x.noAxisLine) {
        ctx.strokeStyle = (x && x.axisLineColor) || defaultAxisLineColor
        ctx.beginPath()
        ctx.moveTo(...axisOriginPos)
        ctx.lineTo(...axisAnglePos.rightBottom)
        ctx.stroke()
      }

      if (!y.noAxisLine) {
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

      drawAxisSeriesTag(...xAxis.map(td => this[td]), x, tagAlign.x, [0, offset], x && x.rotate)
      drawAxisSeriesTag(...yAxis.map(td => this[td]), y, tagAlign.y, [-offset, 0])
      drawAxisSeriesTag(...agXAxis.map(td => this[td]), ax, tagAlign.ax, [0, -offset])
      drawAxisSeriesTag(...agYAxis.map(td => this[td]), ay, tagAlign.ay, [offset, 0])
    },
    drawAxisSeriesTag (tags, tagPos, { tagFontSize, tagFontFamily, tagColor } = {}, align, offset, rotate = false) {
      const { ctx, defaultAxisFontSize, defaultAxisFontFamily, defaultTagColor, drawColors } = this

      let color = tagColor || defaultTagColor

      color === 'colors' && (color = drawColors)

      const colorNum = color.length

      const mulColor = color instanceof Array

      ctx.font = `${tagFontSize || defaultAxisFontSize}px ${tagFontFamily || defaultAxisFontFamily}`

      !mulColor && (ctx.fillStyle = color)

      ctx.textAlign = align[0]
      ctx.textBaseline = align[1]

      tags.forEach((tag, i) => {
        if (!tag) return

        const currentPos = [tagPos[i][0] + offset[0], tagPos[i][1] + offset[1]]

        mulColor && (ctx.fillStyle = color[i % colorNum])

        if (rotate) {
          ctx.save()
          ctx.translate(...currentPos)
          ctx.rotate(Math.PI / 4)
        }

        ctx.fillText(tag, ...(rotate ? [0, 0] : currentPos))

        if (rotate) ctx.restore()
      })
    },
    drawUnit () {}
  }
}
