const fs = require('fs')

// 同步删除文件
fs.unlinkSync('delete.txt')

// 异步删除文件
fs.unlink('delete.txt', err => {
  console.log('删除成功')
})
