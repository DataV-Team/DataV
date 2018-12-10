import methodsExtend from './methodsExtend'

import canvasExtend from './canvasExtend'

import colorExtend from './colorExtend'

import axiosExtend from './axiosExtend'

export default function (Vue) {
  methodsExtend(Vue)
  canvasExtend(Vue)
  colorExtend(Vue)
  axiosExtend(Vue)
}
