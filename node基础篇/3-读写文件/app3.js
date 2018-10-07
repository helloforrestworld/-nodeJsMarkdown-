let fs = require('fs')

let readTxt = fs.readFile('readMe.txt', 'utf-8', (err, data) => {
  console.log('读取完成')
  fs.writeFile('writeMe.txt', data, err => {
    console.log('写入完成')
  })
})

console.log('不会阻塞,立刻执行')
