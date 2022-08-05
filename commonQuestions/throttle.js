// 时间戳版
function throttle (fn, delay) {
  let pre = 0
  return function () {
    let now = new Date()
    if (now - pre > delay) {
      pre = now
      fn.apply(this, arguments)
    }
  }
}

// 定时器版
function throttle (fn, delay) {
  let timer = null
  return function () {
    const context = this
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        fn.apply(context, arguments)
      }, delay)
    }
  }
}
