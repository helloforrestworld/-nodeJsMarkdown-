// 小文件拷贝
let fs = require('fs')
function copy(src, write) {
  // src 源文件路径
  // write 写入位置
  console.log(fs.readFileSync(src))
  fs.writeFileSync(write, fs.readFileSync(src))
}

function main(arg) {
  copy(arg[0], arg[1])
}
// main(['./file-test/test.txt', './test1.txt'])
// node 3-2-file.js ./file-test/test.txt ./test1.txt
main(process.argv.slice(2))