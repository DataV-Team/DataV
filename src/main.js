import Vue from 'vue'
import App from './App.vue'

import './assets/style/index.less'

import plugins from './plugins/index'

import globalComponents from './components/index'

Vue.use(plugins)

Vue.use(globalComponents)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
