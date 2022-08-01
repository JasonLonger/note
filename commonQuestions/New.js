// New
// 1. 创建一个空对象
// 2. 将空对象隐式原型__proto__指向构造函数prototype上
// 3. 执行构造函数，将空对象作为构造函数作用域
// 4. 如果函数没有返回对象，则返回this（步骤3后，this代表新对象，new Object()返回空对象）
function newTest(constructor, ...arg) {
    const obj = {} // 步骤1
    obj.__proto__ = constructor.prototype // 步骤2
    const res = constructor.apply(obj, ...arg) // 步骤3
    return typeof res === 'object' ? res : obj // 步骤4
}
