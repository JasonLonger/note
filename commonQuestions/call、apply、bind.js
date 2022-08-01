call、apply思路
    1. 将函数变成对象的属性
    2. 执行该函数
    3. 删除对象上的该函数属性

// call
Function.prototype.callTest = function (context) {
    if (!context) {
        context = typeof window === 'undefined' ? global : window    
    }
    context.fn = this
    const args = [...arguments].slice(1)
    const result = context.fn(...args)
    delete context.fn
    return result
}

// apply
Function.prototype.applyTest = function (context, rest) {
    if (!context) {
        context = typeof window === 'undefined' ? global : window    
    }
    context.fn = this
    let result
    if (rest === null || rest === undefined) {
        result = context.fn()
    } else {
        result = context.fn(...rest)
    }
    return result
}

// bind: 不会立即执行，可追加一次拼接
Function.prototype.bindTest = function(context) {
    if (typeof this !== "function") {
        throw new TypeError("not a function")    
    }
    let self = this
    let args = [...argument].slice(1) // 获取第一次参数
    function Fn () {}
    Fn.prototype = this.prototype
    const bound = function () {
        const res = [...args, ...arguments] // 拼接第二次参数
        // 注意，这里this和上面this不一样，是新方法bound的执行this
        // 两种情况，原型指向Fn(构造函数)，原型不指向Fn(普通函数，this指向window)
        context = this.instanceof Fn ? this : context || this
        // 通过apply改变this指向，call也行
        return self.apply(context, res)    
    }
    // 原型链继承
    bound.prototype = new Fn()
    return bound
}
