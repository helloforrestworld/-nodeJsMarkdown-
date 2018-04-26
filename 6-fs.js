const fs = require('fs')
fs.rename('./file-test/test3.txt', './file-test/testA.txt', (err) => {
  if (err) {
    console.log(err)
  }
  fs.stat('./file-test/testA.txt', (err, stat) => {
    console.log(stat)
  })
  fs.readFile('./file-test/testA.txt', (err, data) => {
    fs.appendFile('./file-test/appendTXT.txt', data, (err) => {
      console.log(err)
    })
    console.log('appendTXT has been made')
  })
})