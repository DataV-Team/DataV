export default {
  data () {
    return {
      canvasDom: '',
      canvasWH: [0, 0],
      ctx: '',
      centerPos: [0, 0]
    }
  },
  methods: {
    initCanvas () {
      const { $nextTick } = this

      return new Promise(resolve => {
        $nextTick(e => {
          const { $refs, ref, labelRef, canvasWH, centerPos } = this

          const canvas = this.canvasDom = $refs[ref]

          this.labelDom = $refs[labelRef]

          canvasWH[0] = canvas.clientWidth
          canvasWH[1] = canvas.clientHeight

          canvas.setAttribute('width', canvasWH[0])
          canvas.setAttribute('height', canvasWH[1])

          this.ctx = canvas.getContext('2d')

          centerPos[0] = canvasWH[0] / 2
          centerPos[1] = canvasWH[1] / 2

          resolve()
        })
      })
    },
    clearCanvas () {
      const { ctx, canvasWH } = this

      ctx.clearRect(0, 0, ...canvasWH)
    }
  }
}
