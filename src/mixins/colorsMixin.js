import defaultColors from '../config/color.js'

export default {
  data () {
    return {
      defaultColors,

      drawColors: ''
    }
  },
  methods: {
    initColors () {
      const { colors, defaultColors } = this

      this.drawColors = colors || defaultColors
    }
  }
}
