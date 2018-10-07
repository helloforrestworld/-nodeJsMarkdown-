let fs = require('fs')

console.log('startRead')
let readTxt = fs.readFileSync('readMe.txt', 'utf-8')

console.log('文件很大, 阻塞js执行')
let waitTill = Date.now() + 4 * 1000 // 4秒后
while (Date.now() < waitTill) {}

console.log('开始执行其他操作')
