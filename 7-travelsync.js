let fs = require('fs')
let path  = require('path')
function travel(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    let pathname = path.join(dir, file)
    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback)
    } else {
      callback(pathname)
    }
  })
}
travel('./', (file) => {
  console.log(file)
})