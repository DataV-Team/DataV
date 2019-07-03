import fullScreenContainer from './fullScreenContainer/index'
import loading from './loading/index'

// border box
import borderBox1 from './borderBox1/index'
import borderBox2 from './borderBox2/index'
import borderBox3 from './borderBox3/index'
import borderBox4 from './borderBox4/index'
import borderBox5 from './borderBox5/index'
import borderBox6 from './borderBox6/index'
import borderBox7 from './borderBox7/index'
import borderBox8 from './borderBox8/index'
import borderBox9 from './borderBox9/index'

// decoration
import decoration1 from './decoration1/index'
import decoration2 from './decoration2/index'
import decoration3 from './decoration3/index'
import decoration4 from './decoration4/index'
import decoration5 from './decoration5/index'
import decoration6 from './decoration6/index'
import decoration7 from './decoration7/index'
import decoration8 from './decoration8/index'
import decoration9 from './decoration9/index'
import decoration10 from './decoration10/index'

// charts
import charts from './charts/index'

import activeRingChart from './activeRingChart'
import waterLevelPond from './waterLevelPond/index'
import percentPond from './percentPond/index'
import flylineChart from './flylineChart'
import conicalColumnChart from './conicalColumnChart'
import digitalFlop from './digitalFlop'
import scrollBoard from './scrollBoard/index'
import scrollRankingBoard from './scrollRankingBoard/index'

export default function (Vue) {
  Vue.use(fullScreenContainer)
  Vue.use(loading)

  // border box
  Vue.use(borderBox1)
  Vue.use(borderBox2)
  Vue.use(borderBox3)
  Vue.use(borderBox4)
  Vue.use(borderBox5)
  Vue.use(borderBox6)
  Vue.use(borderBox7)
  Vue.use(borderBox8)
  Vue.use(borderBox9)

  // decoration
  Vue.use(decoration1)
  Vue.use(decoration2)
  Vue.use(decoration3)
  Vue.use(decoration4)
  Vue.use(decoration5)
  Vue.use(decoration6)
  Vue.use(decoration7)
  Vue.use(decoration8)
  Vue.use(decoration9)
  Vue.use(decoration10)

  // charts
  Vue.use(charts)

  Vue.use(activeRingChart)
  Vue.use(waterLevelPond)
  Vue.use(percentPond)
  Vue.use(flylineChart)
  Vue.use(conicalColumnChart)
  Vue.use(digitalFlop)
  Vue.use(scrollBoard)
  Vue.use(scrollRankingBoard)
}
