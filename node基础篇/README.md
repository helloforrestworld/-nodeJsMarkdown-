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

订阅/发布

```javascript
let events = require('events')

let myEmitter = new events.EventEmitter()

myEmitter.on('someEvent', info => {
  console.log(info)
})

myEmitter.emit('someEvent', '触发事件')
```

inherits

```javascript
let { EventEmitter } = require('events')
let { inherits } = require('util')

function Person(name) {
  this.name = name
}

// 继承EventEmitter
inherits(Person, EventEmitter)

let somePersons = ['lili', 'gigi', 'bili']
let someInstance = somePersons.map(name => {
  let instance = new Person(name)
  // 订阅事件
  instance.on('speak', message => {
    console.log(name + ' say: ' + message)
  })
  return instance
})

// 发布事件
someInstance[2].emit('speak', 'i am ' + someInstance[2].name)
```

extends

```javascript
let { EventEmitter } = require('events')

class Person extends EventEmitter {
  constructor(name) {
    super()
    this.name = name
  }
}

let somePersons = ['lili', 'gigi', 'bili']
let someInstance = somePersons.map(name => {
  let instance = new Person(name)
  // 订阅事件
  instance.on('speak', message => {
    console.log(name + ' say: ' + message)
  })
  return instance
})

// 发布事件
someInstance[2].emit('speak', 'i am ' + someInstance[2].name)
```

## 读写文件(同步/异步)

同步读写文件

```javascript
let fs = require('fs')

let readTxt = fs.readFileSync('readMe.txt', 'utf-8')

console.log(readTxt)

fs.writeFileSync('writeMe.txt', readTxt)
```

同步读取较大的文件，会阻塞 js 的执行

```javascript
let fs = require('fs')

console.log('startRead')
let readTxt = fs.readFileSync('readMe.txt', 'utf-8')

console.log('文件很大, 阻塞js执行')
let waitTill = Date.now() + 4 * 1000 // 4秒后
while (Date.now() < waitTill) {}

console.log('开始执行其他操作')
```

异步读写

```javascript
let fs = require('fs')

let readTxt = fs.readFile('readMe.txt', 'utf-8', (err, data) => {
  console.log('读取完成')
  fs.writeFile('writeMe.txt', data, err => {
    console.log('写入完成')
  })
})

console.log('不会阻塞,立刻执行')
```

## 创建和删除目录

删除文件

```javascript
const fs = require('fs')

// 同步删除文件
fs.unlinkSync('delete.txt')

// 异步删除文件
fs.unlink('delete.txt', err => {
  console.log('删除成功')
})
```

创建/删除目录

```javascript
const fs = require('fs')

// 创建目录: mkdirSync/mkdir
// 删除目录: rmdirSync/rmdir

fs.mkdirSync('dirSync')

fs.rmdirSync('dirSync')

fs.mkdir('dir', err => {
  console.log('成功创建目录')
  fs.readFile('readMe.txt', 'utf-8', (err, data) => {
    console.log('读取成功')
    fs.writeFile('./dir/writeMe.txt', data, err => {
      console.log('写入成功')
    })
  })
})
```

## 流和管道

可读流/可写流

```javascript
const fs = require('fs')

// let myReadStream = fs.createReadStream(__dirname + '/longTxt.txt') 默认输出buffer

let myReadStream = fs.createReadStream(__dirname + '/longTxt.txt', 'utf8')
let myWriteStream = fs.createWriteStream(__dirname + '/myWriteLong.txt')

// 也可以这样指定编码
// myReadStream.setEncoding('utf8')

let data = ''

myReadStream.on('data', chunk => {
  // 执行多次, 输出多个片段
  console.log(chunk)

  // 拼接字符串片段
  data += chunk

  // 写入流
  myWriteStream.write(chunk)
})

myReadStream.on('end', () => {
  // console.log('结束了')
  // console.log(data)
})
```

管道

```javascript
const fs = require('fs')

let myReadStream = fs.createReadStream(__dirname + '/longTxt.txt', 'utf8')
let myWriteStream = fs.createWriteStream(__dirname + '/myWriteLong.txt')

// 管道
myReadStream.pipe(myWriteStream)
```

管道应用

```javascript
// 压缩
let crypto = require('crypto')
let fs = require('fs')
let zlib = require('zlib')

let password = new Buffer(process.env.PASS || 'password')
let encryptStream = crypto.createCipher('aes-256-cbc', password)

let gzip = zlib.createGzip()
let readStream = fs.createReadStream(__dirname + '/longTxt.txt') // current file
let writeStream = fs.createWriteStream(__dirname + '/out.gz')

readStream // reads current file
  .pipe(encryptStream) // encrypts
  .pipe(gzip) // compresses
  .pipe(writeStream) // writes to out file
  .on('finish', function() {
    // all done
    console.log('done')
  })
```
