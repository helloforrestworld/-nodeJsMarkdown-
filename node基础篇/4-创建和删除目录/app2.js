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
