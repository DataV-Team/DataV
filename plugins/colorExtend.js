const hexReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
const rgbReg = /^(rgb|rgba|RGB|RGBA)/

/**
 * @description           hex color to rgb / rgba color
 * @param      {string}   rgba opacity
 * @return     {string}   rgb / rgba color
 */
export function hexToRgb (hex, opacity) {
  if (!hex || !hexReg.test(hex)) return false

  hex = hex.toLowerCase().replace('#', '')

  // deal 3bit hex color to 6bit hex color
  hex.length === 3 && (hex = Array.from(hex).map(hexNum => hexNum + hexNum).join(''))

  let rgb = []

  for (let i = 0; i < 6; i += 2) {
    rgb.push(parseInt(`0x${hex.slice(i, i + 2)}`))
  }

  rgb = rgb.join(',')

  if (opacity) {
    return `rgba(${rgb}, ${opacity})`
  } else {
    return `rgb(${rgb})`
  }
}

/**
 * @description           rgb / rgba color to hex color
 * @return     {string}   hex color
 */
export function rgbToHex (rgb) {
  if (!rgb || !rgbReg.test(rgb)) return false

  rgb = rgb.toLowerCase().replace(/rgb\(|rgba\(|\)/g, '').split(',').slice(0, 3)

  const hex = rgb.map((rgbNum) => Number(rgbNum).toString(16)).map((rgbNum) => rgbNum === '0' ? rgbNum + rgbNum : rgbNum).join('')

  return `#${hex}`
}

const color = {
  hexToRgb,
  rgbToHex
}

export default function (Vue) {
  Vue.prototype.color = color
}
