/**
 * IMPORT COMPONENTS
 */
import fullScreenContainer from './components/fullScreenContainer/index'
import loading from './components/loading/index'

// border box
import borderBox1 from './components/borderBox1/index'
import borderBox2 from './components/borderBox2/index'
import borderBox3 from './components/borderBox3/index'
import borderBox4 from './components/borderBox4/index'
import borderBox5 from './components/borderBox5/index'
import borderBox6 from './components/borderBox6/index'
import borderBox7 from './components/borderBox7/index'
import borderBox8 from './components/borderBox8/index'
import borderBox9 from './components/borderBox9/index'
import borderBox10 from './components/borderBox10/index'
import borderBox11 from './components/borderBox11/index'
import borderBox12 from './components/borderBox12/index'
import borderBox13 from './components/borderBox13/index'

// decoration
import decoration1 from './components/decoration1/index'
import decoration2 from './components/decoration2/index'
import decoration3 from './components/decoration3/index'
import decoration4 from './components/decoration4/index'
import decoration5 from './components/decoration5/index'
import decoration6 from './components/decoration6/index'
import decoration7 from './components/decoration7/index'
import decoration8 from './components/decoration8/index'
import decoration9 from './components/decoration9/index'
import decoration10 from './components/decoration10/index'
import decoration11 from './components/decoration11/index'

// charts
import charts from './components/charts/index'

import activeRingChart from './components/activeRingChart'
import capsuleChart from './components/capsuleChart'
import waterLevelPond from './components/waterLevelPond/index'
import percentPond from './components/percentPond/index'
import flylineChart from './components/flylineChart'
import flylineChartEnhanced from './components/flylineChartEnhanced'
import conicalColumnChart from './components/conicalColumnChart'
import digitalFlop from './components/digitalFlop'
import scrollBoard from './components/scrollBoard/index'
import scrollRankingBoard from './components/scrollRankingBoard/index'

/**
 * USE COMPONENTS
 */
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
  Vue.use(borderBox10)
  Vue.use(borderBox11)
  Vue.use(borderBox12)
  Vue.use(borderBox13)

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
  Vue.use(decoration11)

  // charts
  Vue.use(charts)

  Vue.use(activeRingChart)
  Vue.use(capsuleChart)
  Vue.use(waterLevelPond)
  Vue.use(percentPond)
  Vue.use(flylineChart)
  Vue.use(flylineChartEnhanced)
  Vue.use(conicalColumnChart)
  Vue.use(digitalFlop)
  Vue.use(scrollBoard)
  Vue.use(scrollRankingBoard)
}
