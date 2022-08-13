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

// 原型式继承
// ES5之前
const Fn = { name: 'Jack' }
function createFn(Fn) {
  function fn() {}
  fn.prototype = Fn
  return new fn()
}
const test = createFn(Fn)

// ES6后
const Fn = { name: 'Jack' }
const test = Object.create(Fn)
优点：对一个对象进行浅拷贝创建另一个对象，同时继承该对象的原型属性
缺点：由于是浅拷贝，所有实例共享，如果是引用值，存在污染可能。


// 寄生继承
// 实现：在原型式继承的基础上，增强对象，返回构造函数
function createFn(Fn) {
  const clone = object(Fn) // 通过调用object()函数创建一个新对象 new Object(Fn)
  clone.sayHi = function() { // 添加方法增强对象
    console.log('hi')
  }
  return clone // 返回这个对象
}
const person = { name: 'Jack' }
const test = createFn(person)
test.sayHi() // hi

// 缺点：（同原型式继承）
多实例共享相同属性，存在篡改可能
无法传递参数


// 寄生组合式继承（最常见，也是最成熟）
实现：借用构造函数继承+原型式继承
function Fn() { this.nam = 'Jack' }
Fn.prototype.say = function() { console.log('111') }
function fn() {
  fn.call(this)
  this.age = 18
}

// 重点
fn.prototype = Object.create(Fn.prototype)
fn.prototype.constructor = fn

const test = new fn()

// ES6继承
// extends

class Test {
  constructor() {
    this.name = 'aaa'
  }
}

class test extends Test {
  constructor() {
    super()
  }
}

const test1 = new test()
test1.name // 'aaa'

// ES5和ES6主要区别
ES5主要是先创建子类实例this，然后通过apply(this, argments)添加父类的方法
ES6则是先通过super调用父类构造函数，创建父类this，包含父类的属性和方法，然后子类继承父类this，同时可以通过constructor修饰ths，添加一些属性等。
