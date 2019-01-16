export default {
  data () {
    return {
      defaultColors: [
        '#9cf4a7', '#66d7ee', '#eee966',
        '#a866ee', '#ee8f66', '#ee66aa'
      ],

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
