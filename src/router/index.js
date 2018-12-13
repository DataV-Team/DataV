import Vue from 'vue'

import Router from 'vue-router'

const Demo = r => require.ensure([], () => r(require('../views/demo/index.vue')), 'demo')

const Document = r => require.ensure([], () => r(require('../views/demo/document.vue')), 'demo')

const BorderBox = r => require.ensure([], () => r(require('../views/demo/borderBox.vue')), 'demo')

const Decoration = r => require.ensure([], () => r(require('../views/demo/decoration.vue')), 'demo')

const Chart = r => require.ensure([], () => r(require('../views/demo/chart.vue')), 'demo')

const Table = r => require.ensure([], () => r(require('../views/demo/table.vue')), 'datav')

const Datav = r => require.ensure([], () => r(require('../views/datavEntrance/index.vue')), 'datav')

const View = r => require.ensure([], () => r(require('../views/dataView/index.vue')), 'datav')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/demo',
      name: 'demo',
      component: Demo,
      children: [
        {
          path: 'document',
          name: 'document',
          component: Document
        },
        {
          path: 'borderBox',
          name: 'borderBox',
          component: BorderBox
        },
        {
          path: 'decoration',
          name: 'decoration',
          component: Decoration
        },
        {
          path: 'chart',
          name: 'chart',
          component: Chart
        },
        {
          path: 'table',
          name: 'table',
          component: Table
        }
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
      redirect: { name: 'demo' }
    }
  ]
})
