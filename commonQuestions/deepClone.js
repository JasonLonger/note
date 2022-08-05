// 最简单的深拷贝
JSON.parse(JSON.stringify(obj)) // 性能最快
// 存在问题： 设计初衷是用以json格式解析= =所以被用以深拷贝，其他类型如时间、日期等格式不一定适用，使用后方法调用不了

// 通过遍历递归自己实现
function deepClone(obj) { // 递归拷贝
  if (typeof obj !== 'object' || obj === null) {
    // 如果不是复杂数据类型或者为null，直接返回
    return obj
  }
  // 利用instanceof判断日期或者正则表达式
  if (obj instanceof RegExp) return new RegExp(obj)
  if (obj instanceof Date) return new Date(obj)
  
  let result = obj instanceof Array ? [] : {}
  
  for (let key in obj) {
    // 判断是否是对象自身属性，筛掉对象原型链上继承的属性
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key])
    }
  }
  
  return result
}
