export default {
  data () {
    return {
      defaultHorizon: false,
      defaultXAxisFS: 10,
      defaultYAxisFS: 10,
      defaultXOffset: 30,
      defaultRotateAngel: 30,

      defaultXAxisLineColor: 'rgba(255, 255, 255, 0.3)',
      defaultYAxisLineColor: 'rgba(255, 255, 255, 0.3)',

      horizon: false,
      // user data's max and min value
      valueMaxMin: [],
      // axis's max and min value
      axisMaxMin: [],
      // label's max width where x and y Axis
      labelXYMaxWidth: [],
      valueAxisTag: [],
      labelAxisTag: [],
      xyAxisFS: [],
      xyAxisUnitWidth: [],
      axisMargin: [],
      axisOriginPos: [],
      axisWH: [],
      valueTagPos: [],
      labelTagPos: [],
      valueTagGap: 0,
      labelTagGap: 0,
      xTagColor: '',
      yTagColor: '',
      xTagColorMul: false,
      yTagColorMul: false
    }
  },
  methods: {
    initAxis () {
      const { calcMaxMinValue, calcValueAxisTag, calcLabelAxisTag, calcXYAxisFS } = this

      calcMaxMinValue()

      calcValueAxisTag()

      calcLabelAxisTag()

      calcXYAxisFS()

      const { calcXYLabelMaxWidth, calcAxisMargin, calcAxisOriginPos } = this

      calcXYLabelMaxWidth()

      calcAxisMargin()

      calcAxisOriginPos()

      const { calcAxisWH, calcValueTagPos, calcLabelTagPos, calcTagGap, calcTagColor } = this

      calcAxisWH()

      calcValueTagPos()

      calcLabelTagPos()

      calcTagGap()

      calcTagColor()
    },
    calcMaxMinValue () {
      const { data: { data }, multipleSum, filterNull, getArrayMaxMin } = this

      const trueValue = data.map(item =>
        item.map(v =>
          v ? (typeof v === 'number' ? v : multipleSum(...filterNull(v))) : false))

      this.valueMaxMin = getArrayMaxMin(trueValue)
    },
    calcValueAxisTag () {
      const { valueMaxMin: [ valueMax, valueMin ], data, defaultHorizon } = this

      const { horizon } = data

      this.horizon = horizon || defaultHorizon

      let { max, min, num, fixed } = data[horizon ? 'x' : 'y']

      let [trueMax, trueMin] = [max, min]

      const thirdValueMinus = parseInt((valueMax - valueMin) / 3)

      !max && (max !== 0) && (trueMax = valueMax + thirdValueMinus)
      !min && (min !== 0) && (trueMin = valueMin - thirdValueMinus)

      const trueMinus = trueMax - trueMin

      !num && trueMinus < 9 && (num = trueMinus + 1)
      !num && (num = 10)

      const valueGap = trueMinus / (num - 1)

      const valueAxisTag = this.valueAxisTag = Array(num).fill(0).map((t, i) =>
        (trueMin + i * valueGap).toFixed(fixed))

      const lastValueAxisTagIndex = valueAxisTag.length - 1

      this.axisMaxMin = [parseFloat(valueAxisTag[lastValueAxisTagIndex]), parseFloat(valueAxisTag[0])]
    },
    calcLabelAxisTag () {
      const { data, horizon } = this

      this.labelAxisTag = data[horizon ? 'y' : 'x'].data
    },
    calcXYAxisFS () {
      const { defaultXAxisFS, defaultYAxisFS } = this

      const { data: { x: { fontSize: xfs }, y: { fontSize: yfs } } } = this

      this.xyAxisFS = [xfs || defaultXAxisFS, yfs || defaultYAxisFS]
    },
    calcXYLabelMaxWidth () {
      const { ctx, valueAxisTag, labelAxisTag, horizon, xyAxisFS } = this

      const { canvas: { getTextsWidth } } = this

      const { data: { x: { unit: xUN }, y: { unit: yUN } } } = this

      ctx.font = `${xyAxisFS[0]}px Arial`

      this.labelXYMaxWidth[0] = Math.max(...getTextsWidth(ctx, horizon ? labelAxisTag : valueAxisTag))

      this.xyAxisUnitWidth[0] = ctx.measureText(xUN || '').width

      ctx.font = `${xyAxisFS[1]}px Arial`

      this.labelXYMaxWidth[1] = Math.max(...getTextsWidth(ctx, horizon ? valueAxisTag : labelAxisTag))

      this.xyAxisUnitWidth[1] = ctx.measureText(yUN || '').width
    },
    calcAxisMargin () {
      const { defaultXOffset, labelXYMaxWidth, data, xyAxisUnitWidth } = this

      const { offset: xOF, unitWidth: xUW } = data.x

      const { offset: yOF, unitHeight: yUH } = data.y

      this.axisMargin[0] = yUH || defaultXOffset
      this.axisMargin[1] = xUW || xyAxisUnitWidth[0] + 10
      this.axisMargin[2] = xOF || defaultXOffset
      this.axisMargin[3] = yOF || labelXYMaxWidth[1] + 10
    },
    calcAxisOriginPos () {
      const { axisMargin, canvasWH } = this

      this.axisOriginPos[0] = axisMargin[3]
      this.axisOriginPos[1] = canvasWH[1] - axisMargin[2]

      this.ctx.arc(...this.axisOriginPos, 3, 0, Math.PI * 2)
    },
    calcAxisWH () {
      const { axisMargin, canvasWH } = this

      this.axisWH[0] = canvasWH[0] - axisMargin[1] - axisMargin[3]
      this.axisWH[1] = canvasWH[1] - axisMargin[0] - axisMargin[2]
    },
    calcValueTagPos () {
      const { axisWH, valueAxisTag, horizon, axisOriginPos: [x, y] } = this

      const valueTagNum = valueAxisTag.length

      const gapWidth = (horizon ? axisWH[0] : axisWH[1]) / (valueTagNum - 1)

      this.valueTagPos = new Array(valueTagNum).fill(0).map((t, i) =>
        horizon ? [x + gapWidth * i, y + 5] : [x - 5, y - gapWidth * i])
    },
    calcLabelTagPos () {
      const { axisWH, labelAxisTag, horizon, axisOriginPos: [x, y], data, axisType } = this

      const { boundaryGap } = data

      const labelNum = labelAxisTag.length

      const gapAllWidth = horizon ? axisWH[1] : axisWH[0]

      const tempArray = new Array(labelNum).fill(0)

      if (axisType === 'column' || (axisType === 'line' && boundaryGap)) {
        const gapWidth = gapAllWidth / labelNum

        const halfGapWidth = gapWidth / 2

        this.labelTagPos = tempArray.map((t, i) =>
          horizon ? [x - 5, y - gapWidth * i - halfGapWidth] : [x + gapWidth * i + halfGapWidth, y + 5])
      }

      if (axisType === 'line' && !boundaryGap) {
        const gapWidth = gapAllWidth / (labelNum - 1)

        this.labelTagPos = tempArray.map((t, i) =>
          horizon ? [x - 5, y - gapWidth] : [x + gapWidth * i, y + 5])
      }
    },
    calcTagGap () {
      const { horizon, valueTagPos, labelTagPos } = this

      const v = horizon ? '0' : '1'

      this.valueTagGap = Math.abs(valueTagPos[0][v] - valueTagPos[1][v])

      const l = horizon ? '1' : '0'

      this.labelTagGap = Math.abs(labelTagPos[0][l] - labelTagPos[1][l])
    },
    calcTagColor () {
      const { defaultXAxisLineColor, defaultYAxisLineColor, drawColors, data } = this

      const { x: { color: xc }, y: { color: yc } } = data

      let xTagColor = xc || defaultXAxisLineColor

      xTagColor === 'colors' && (xTagColor = drawColors)

      let yTagColor = yc || defaultYAxisLineColor

      yTagColor === 'colors' && (yTagColor = drawColors)

      this.xTagColor = xTagColor

      this.xTagColorMul = xTagColor instanceof Array

      this.yTagColor = yTagColor

      this.yTagColorMul = yTagColor instanceof Array
    },
    drawAxis () {
      const { drawAxisLine, drawAxisTag } = this

      drawAxisLine()

      drawAxisTag()
    },
    drawAxisLine () {
      const { ctx, defaultXAxisLineColor, defaultYAxisLineColor, axisOriginPos, axisWH, data } = this

      const { x: { lineColor: xlc }, y: { lineColor: ylc } } = data

      ctx.lineWidth = 1

      ctx.strokeStyle = xlc || defaultXAxisLineColor
      ctx.beginPath()
      ctx.moveTo(...axisOriginPos)
      ctx.lineTo(axisOriginPos[0] + axisWH[0], axisOriginPos[1])
      ctx.stroke()

      ctx.strokeStyle = ylc || defaultYAxisLineColor
      ctx.beginPath()
      ctx.moveTo(...axisOriginPos)
      ctx.lineTo(axisOriginPos[0], axisOriginPos[1] - axisWH[1])

      ctx.stroke()
    },
    drawAxisTag () {
      const { ctx, horizon, valueTagPos, labelTagPos, valueAxisTag, labelAxisTag } = this

      const { xTagColor, xTagColorMul, yTagColor, yTagColorMul, xyAxisFS } = this

      const xAxisData = horizon ? valueTagPos : labelTagPos
      const yAxisData = horizon ? labelTagPos : valueTagPos

      const xTagData = horizon ? valueAxisTag : labelAxisTag
      const yTagData = horizon ? labelAxisTag : valueAxisTag

      !xTagColorMul && (ctx.fillStyle = xTagColor)

      const xTagColorNum = xTagColor.length

      ctx.font = `${xyAxisFS[0]}px Arial`

      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'

      xAxisData.forEach((pos, i) => {
        xTagColorMul && (ctx.fillStyle = xTagColor[i % xTagColorNum])

        ctx.fillText(xTagData[i], ...pos)
      })

      !yTagColorMul && (ctx.fillStyle = yTagColor)

      const yTagColorNum = yTagColor.length

      ctx.font = `${xyAxisFS[1]}px Arial`

      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'

      yAxisData.forEach((pos, i) => {
        xTagColorMul && (ctx.fillStyle = yTagColor[i % yTagColorNum])

        ctx.fillText(yTagData[i], ...pos)
      })

      this.ctx.fill()
    }
  }
}
