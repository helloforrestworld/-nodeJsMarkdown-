let exec = require('child_process').exec
let util = require('util')

exec('cp -r file-test/* newdir', (err, stdout, stderr) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(stdout, stderr)
  console.log('拷贝成功')
})

function copy(source, target, callback) {
  console.log(util.format('cp -r %s/* %s', source, target))
  exec(util.format('cp -r %s/* %s', source, target), callback)
}

// cp -r file-test/* newdir
// copy('file-test', 'newdir', (err, stdout, stderr) => {
//   console.log(stdout, stderr)
//   if (err) {
//     console.log(err)
//     return
//   }
//   console.log('拷贝成功')
// })