import borderBox1 from './borderBox1/index'
import borderBox2 from './borderBox2/index'
import borderBox3 from './borderBox3/index'
import borderBox4 from './borderBox4/index'

import decoration1 from './decoration1/index'
import decoration2 from './decoration2/index'

import numberShow from './numberShow/index.vue'

import capsuleChart from './capsuleChart/index.vue'
import ringChart from './ringChart/index.vue'

export default function (Vue) {
  Vue.component('borderBox1', borderBox1)
  Vue.component('borderBox2', borderBox2)
  Vue.component('borderBox3', borderBox3)
  Vue.component('borderBox4', borderBox4)
  Vue.component('decoration1', decoration1)
  Vue.component('decoration2', decoration2)
  Vue.component('numberShow', numberShow)
  Vue.component('capsuleChart', capsuleChart)
  Vue.component('ringChart', ringChart)
}
