const Document = r => require.ensure([], () => r(require('../views/demo/document.vue')), 'demo')

const BorderBox = r => require.ensure([], () => r(require('../views/demo/borderBox.vue')), 'demo')

const Decoration = r => require.ensure([], () => r(require('../views/demo/decoration.vue')), 'demo')

const Chart = r => require.ensure([], () => r(require('../views/demo/chart.vue')), 'demo')

const Other = r => require.ensure([], () => r(require('../views/demo/other.vue')), 'datav')

const Show = r => require.ensure([], () => r(require('../views/demo/show.vue')), 'datav')

export default [
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
    path: 'other',
    name: 'other',
    component: Other
  },
  {
    path: 'show',
    name: 'show',
    component: Show
  }
]
