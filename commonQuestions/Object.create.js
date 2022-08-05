// 思路：将传入的对象作为原型
function create(obj) {
  function Fn() {}
  Fn.prototype = obj
  return new Fn()
}

用途：原型链继承
const test = new Person() // 继承父类实例
const test1 = create(test) // 原型链继承
重点：用一个函数包装一个对象，然后返回这个函数的调用，这个函数就变成了个可以随意增添属性的实例或对象
特点：类似复制一个对象，用函数包装
缺点：
  1. 所有实例都会继承原型上得到属性
  2. 无法实现复现（新实例属性都是后面添加的）
