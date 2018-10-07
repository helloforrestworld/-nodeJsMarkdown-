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
