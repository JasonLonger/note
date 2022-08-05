instanceof运算符用来判断构造函数的prototype属性是否出现在对象的原型链中的任何位置
function myInstanceof(left, right) {
    // 获取对象的原型
    let leftProto = object.getPrototypeOf(left)
    // 获取构造函数的prototype对象
    let rightPrototype = right.prototype
    while(true) {
        if (!leftProto) return false
        if (leftProto === rightPrototype) return true
        leftProto = Object.getPrototypeOf(leftProto)    
    }
}
