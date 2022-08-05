/**
 * @description 函数防抖
 * @param {*} fn 函数
 * @param {Number} delay 延迟时间，单位毫秒
 * @param {Boolean} immediate true 立即执行，false 非立即执行
 */
function debounce(fn, delay, immediate) {
  let timer = null
  return function () {
    if (timer) clearTimeout(timer)
    const context = null
    if (immediate) {
      let callNow = !timer
      timer = setTimeout(() => {
        timer = null
      })
      if (callNow) fn.apply(context, arguments)
    } else {
      timer = setTimeout(() => {
        fn.apply(context, arguments)
      })
    }
  }
}
// 注意点
1. 防抖的实现其实利用了许多javascript基础，如闭包建立定时器们的联系，apply改变this取值，ES6箭头函数的作用域等
2. 利用定时器setTimeout实现防抖，根据setTimeout返回id清除定时器达到防重复触发效果，有点类似websocket的心跳测试
3. setTimeout有个问题是它不是很精确，例如设置了10ms，但在9ms后有个同步任务，或者微任务在占用执行栈执行，
就会导致setTimeout延后执行，因为setTimeout是宏任务，具体可以了解一下事件循环。
