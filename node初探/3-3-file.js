let fs = require('fs')
function copy(src, write) {
  fs.createReadStream(src).pipe(fs.createWriteStream(write))
}

function main(arg) {
  copy(arg[0], arg[1])
}

main(process.argv.slice(2))