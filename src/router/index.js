import Vue from 'vue'

import Router from 'vue-router'

import demoChildren from './demo'

const Demo = r => require.ensure([], () => r(require('../views/demo/index.vue')), 'demo')

const Datav = r => require.ensure([], () => r(require('../views/datavEntrance/index.vue')), 'datav')

const View = r => require.ensure([], () => r(require('../views/dataView/index.vue')), 'datav')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/demo',
      name: 'demo',
      component: Demo,
      redirect: { name: 'document' },
      children: [
        ...demoChildren
      ]
    },
    {
      path: '/datav',
      name: 'datav',
      component: Datav,
      redirect: '/datav/view',
      children: [
        {
          path: 'view',
          name: 'view',
          component: View
        },
        {
          path: '*',
          redirect: '/datav/view'
        }
      ]
    },
    {
      path: '*',
      redirect: { name: 'document' }
    }
  ]
})
