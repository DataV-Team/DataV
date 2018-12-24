import borderBox1 from './borderBox1/index'
import borderBox2 from './borderBox2/index'
import borderBox3 from './borderBox3/index'
import borderBox4 from './borderBox4/index'
import borderBox5 from './borderBox5/index'
import borderBox6 from './borderBox6/index'
import borderBox7 from './borderBox7/index'

import decoration1 from './decoration1/index'
import decoration2 from './decoration2/index'
import decoration3 from './decoration3/index'
import decoration4 from './decoration4/index'
import decoration5 from './decoration5/index'
import decoration6 from './decoration6/index'
import decoration7 from './decoration7/index'
import loading from './loading/index.vue'

import capsuleChart from './capsuleChart/index.vue'
import ringChart from './ringChart/index.vue'
import polylineChart from './polylineChart/index.vue'
import concentricArcChart from './concentricArcChart/index.vue'
import arcRingChart from './arcRingChart/index.vue'
import radarChart from './radarChart/index.vue'
import columnChart from './columnChart/index.vue'
import pointChart from './pointChart/index.vue'

import numberShow from './numberShow/index.vue'
import percentPond from './percentPond/index.vue'
import percentArc from './percentArc/index.vue'
import waterLevelPond from './waterLevelPond/index.vue'
import scrollBoard from './scrollBoard/index.vue'

import labelLine from './labelLine'
import forSlot from './forSlot'

export default function (Vue) {
  Vue.component('borderBox1', borderBox1)
  Vue.component('borderBox2', borderBox2)
  Vue.component('borderBox3', borderBox3)
  Vue.component('borderBox4', borderBox4)
  Vue.component('borderBox5', borderBox5)
  Vue.component('borderBox6', borderBox6)
  Vue.component('borderBox7', borderBox7)

  Vue.component('decoration1', decoration1)
  Vue.component('decoration2', decoration2)
  Vue.component('decoration3', decoration3)
  Vue.component('decoration4', decoration4)
  Vue.component('decoration5', decoration5)
  Vue.component('decoration6', decoration6)
  Vue.component('decoration7', decoration7)
  Vue.component('loading', loading)

  Vue.component('capsuleChart', capsuleChart)
  Vue.component('polylineChart', polylineChart)
  Vue.component('ringChart', ringChart)
  Vue.component('concentricArcChart', concentricArcChart)
  Vue.component('arcRingChart', arcRingChart)
  Vue.component('radarChart', radarChart)
  Vue.component('columnChart', columnChart)
  Vue.component('pointChart', pointChart)

  Vue.component('numberShow', numberShow)
  Vue.component('percentPond', percentPond)
  Vue.component('percentArc', percentArc)
  Vue.component('waterLevelPond', waterLevelPond)
  Vue.component('scrollBoard', scrollBoard)

  Vue.component('labelLine', labelLine)
  Vue.component('forSlot', forSlot)
}
