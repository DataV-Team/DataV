import methodsExtend from './methodsExtend'

import canvasExtend from './canvasExtend'

import axiosExtend from './axiosExtend'

export default function (Vue) {
  methodsExtend(Vue)
  canvasExtend(Vue)
  axiosExtend(Vue)
}
