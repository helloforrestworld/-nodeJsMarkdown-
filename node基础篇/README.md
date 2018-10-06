# node 基础篇

## 全局对象

- console
- setTimeout、setInterval
- \_\_dirname 当前文件所有目录路径
- require、exports、module
- process

## 模块

nodeJs 通过 require 引入模块, 通过 module.exports/exports 导出模块

例如

```javascript
// JS A
module.exports = function() {
  console.log(1)
}

// JS B
const fnFromA = require('./jsa') // JS A 文件路径
fnFromA() // 1

// 也可以
module.exports = {
  a: 1,
  b() {
    console.log(1)
  }
}
// 或者
module.exports.a = 1
```

module.exports 与 exports 区别

1. module.exports 初始值为一个空对象 {}
2. exports 是指向的 module.exports 的引用
3. require() 返回的是 module.exports 而不是 exports

例子

```javascript
const fn = () => {}

exports.fn = fn // 能正常导出
exports = {
  // 不能正常导出, 因为require的是module.exports
  fn: fn
}
```

## 事件
