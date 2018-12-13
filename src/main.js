import Vue from 'vue'
import App from './App.vue'
import router from './router/index'

import './assets/style/index.less'

import plugins from './plugins/index'

import components from './components/index'

Vue.use(plugins)

Vue.use(components)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
