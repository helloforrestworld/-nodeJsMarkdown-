const fs = require('fs')

let myReadStream = fs.createReadStream(__dirname + '/longTxt.txt', 'utf8')
let myWriteStream = fs.createWriteStream(__dirname + '/myWriteLong.txt')

// 管道
myReadStream.pipe(myWriteStream)
