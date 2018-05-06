const fs = require('fs')

// 传统callback方式
// fs.readFile('./package.json', (err, data) => {
//   if (err) {
//     return console.log(err)
//   }
//   data = JSON.parse(data)
//   console.log(data.name)
// })

// 过渡时期的做法
// function readFileAsync(path) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(path, (err, data) => {
//       if (err) {
//         return reject(err)
//       }
//       resolve(data)
//     })
//   })
// }
// 
// readFileAsync('./package.json')
// .then((data) => {
//   console.log(JSON.parse(data))
// })
// .catch((err) => {
//   console.log(err)
// })

// util模块的promisify方法
const util = require('util')

util.promisify(fs.readFile)('./package.json')
.then(JSON.parse)
.then(data => {
  console.log(data)
})
.catch(err => {
  console.log(err)
})