import defaultColors from '../config/color.js'

export default {
  data () {
    return {
      defaultColors,

      drawColors: '',

      drawColorsMul: false
    }
  },
  methods: {
    initColors () {
      const { colors, defaultColors } = this

      const trueDrawColors = this.drawColors = colors || defaultColors

      this.drawColorsMul = trueDrawColors instanceof Array
    }
  }
}
