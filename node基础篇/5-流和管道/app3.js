// 压缩
let crypto = require('crypto')
let fs = require('fs')
let zlib = require('zlib')

let password = new Buffer(process.env.PASS || 'password')
let encryptStream = crypto.createCipher('aes-256-cbc', password)

let gzip = zlib.createGzip()
let readStream = fs.createReadStream(__dirname + '/longTxt.txt') // current file
let writeStream = fs.createWriteStream(__dirname + '/out.gz')

readStream // reads current file
  .pipe(encryptStream) // encrypts
  .pipe(gzip) // compresses
  .pipe(writeStream) // writes to out file
  .on('finish', function() {
    // all done
    console.log('done')
  })
