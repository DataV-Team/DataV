export function randomExtend (minNum, maxNum) {
  if (arguments.length === 1) {
    return parseInt(Math.random() * minNum + 1, 10)
  } else {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
  }
}

export function debounce (delay, callback) {
  let lastTime

  return function () {
    clearTimeout(lastTime)

    const [that, args] = [this, arguments]

    lastTime = setTimeout(() => {
      callback.apply(that, args)
    }, delay)
  }
}

export function observerDomResize (dom, callback) {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

  const observer = new MutationObserver(callback)

  observer.observe(dom, { attributes: true, attributeFilter: ['style'], attributeOldValue: true })

  return observer
}

export function getPointDistance (pointOne, pointTwo) {
  const minusX = Math.abs(pointOne[0] - pointTwo[0])

  const minusY = Math.abs(pointOne[1] - pointTwo[1])

  return Math.sqrt(minusX * minusX + minusY * minusY)
}

export function uuid (hasHyphen) {
  return (hasHyphen ? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' : 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx').replace(/[xy]/g, function (c) {
		const r = Math.random() * 16 | 0
		const v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16)
  })
}


/**
* 转换为rgba
* @param sHex  
* @param alpha
*/
 export function colorRgba(sHex, alpha = 1) {
  if (sHex.indexOf('rgb') === -1) {
    // 十六进制颜色值的正则表达式
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/
    /* 16进制颜色转为RGB格式 */
    let sColor = sHex.toLowerCase()
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4 || sColor.length === 5) {
        var sColorNew = '#'
        for (var i = 1; i < sColor.length; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
        }
        sColor = sColorNew
      }
      // 如果有透明度并且传入的透明度为1再执行
      if (sColor.length === 9 && alpha === 1) {
        alpha = Number((parseInt('0x' + sColor.slice(7, 9)) / 255).toFixed(2))
      }
      //  处理六位的颜色值
      var sColorChange = []
      for (var i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
      }
      return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
    } else {
      return sColor
    }
  }
  else { // 若原本就是rgba或rgb，则需要再次转换
    let colorList = sHex.replace('rgba(', '').replace('rgb(', '').replace(')', '').replace(/\s*/g, "").split(',')
    if (colorList.length === 4) // 若为rgba
      colorList.pop() //删除最后一个
    return ('rgba(' + colorList.join(',') + ',' + alpha + ')')
  }
}