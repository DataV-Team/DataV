import fullScreenContainer from './fullScreenContainer'
import loading from './loading/index.vue'

// border box
import borderBox1 from './borderBox1/index'
import borderBox2 from './borderBox2/index'
import borderBox3 from './borderBox3/index'
import borderBox4 from './borderBox4/index'
import borderBox5 from './borderBox5/index'
import borderBox6 from './borderBox6/index'
import borderBox7 from './borderBox7/index'
import borderBox8 from './borderBox8/index'

// decoration
import decoration1 from './decoration1/index'
import decoration2 from './decoration2/index'
import decoration3 from './decoration3/index'
import decoration4 from './decoration4/index'
import decoration5 from './decoration5/index'
import decoration6 from './decoration6/index'
import decoration7 from './decoration7/index'
import decoration8 from './decoration8/index'

// charts
import charts from './charts/index.vue'

import activeRingChart from './activeRingChart'
import waterLevelPond from './waterLevelPond/index.vue'
import percentPond from './percentPond/index.vue'
import flylineChart from './flylineChart'
import digitalFlop from './digitalFlop'
import scrollBoard from './scrollBoard/index.vue'

export default function (Vue) {
  Vue.component('dvFullScreenContainer', fullScreenContainer)

  Vue.component('dvLoading', loading)

  // border box
  Vue.component('dvBorderBox1', borderBox1)
  Vue.component('dvBorderBox2', borderBox2)
  Vue.component('dvBorderBox3', borderBox3)
  Vue.component('dvBorderBox4', borderBox4)
  Vue.component('dvBorderBox5', borderBox5)
  Vue.component('dvBorderBox6', borderBox6)
  Vue.component('dvBorderBox7', borderBox7)
  Vue.component('dvBorderBox8', borderBox8)

  // decoration
  Vue.component('dvDecoration1', decoration1)
  Vue.component('dvDecoration2', decoration2)
  Vue.component('dvDecoration3', decoration3)
  Vue.component('dvDecoration4', decoration4)
  Vue.component('dvDecoration5', decoration5)
  Vue.component('dvDecoration6', decoration6)
  Vue.component('dvDecoration7', decoration7)
  Vue.component('dvDecoration8', decoration8)

  // charts
  Vue.component('dvCharts', charts)

  Vue.component('dvActiveRingChart', activeRingChart)
  Vue.component('dvWaterLevelPond', waterLevelPond)
  Vue.component('dvPercentPond', percentPond)
  Vue.component('dvFlylineChart', flylineChart)
  Vue.component('dvDigitalFlop', digitalFlop)

  // Vue.component('dvScrollBoard', scrollBoard)
}
