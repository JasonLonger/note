// 原型链继承
function Fn() {
  this.name = 'Jack'
}

function fn() {}
fn.prototype = new Fn() // 重点
let test = new fn()

console.log(test.name) // 'Jack'
// 缺点：多实例共享属性或方法，改动一个实例属性就会影响到其他实例


// 借用构造函数继承
function Fn() {
  this.name = 'Jack'
}
function fn() {
  Fn.call(this) // 重点，利用构造函数改变this指向
  // Fn.apply(this)
}
let test = new fn()
console.log(test.name) // 'Jack'
// 缺点：
// 只能继承父类的实例属性和方法，不能继承原型属性和方法
// 无法实现复用，每个子类都有父类实例函数的副本，影响性能


// 组合继承
// 实现：原型继承 + 借用构造函数继承
function Fn() {
  this.name = 'Jack'
}
Fn.prototype.say = function() { console.log('Mack') }
function fn() {
  Fn.call(this)
}
fn.prototype = new Fn()
const test = new fn()
console.log(test.say())
