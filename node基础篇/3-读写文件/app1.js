let fs = require('fs')

let readTxt = fs.readFileSync('readMe.txt', 'utf-8')

console.log(readTxt)

fs.writeFileSync('writeMe.txt', readTxt)
