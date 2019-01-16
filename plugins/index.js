import methodsExtend from './methodsExtend'

import canvasExtend from './canvasExtend'

import colorExtend from './colorExtend'

export default function (Vue) {
  methodsExtend(Vue)
  canvasExtend(Vue)
  colorExtend(Vue)
}
