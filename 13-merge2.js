const http = require('http')
const path = require('path')
const fs = require('fs')

const MIME = {
  '.css': 'text/css',
  '.js': 'application/javascript'
}


function main(argv) {
  let config = JSON.parse(fs.readFileSync(argv[0], 'utf-8'))
  let port = config.port || 80
  let root = config.root || '.'
  let server = http.createServer(function(request, response) {
    let url = request.url
    let urlInfo = parseUrl(root, url)
    validataUrl(urlInfo.pathnames, (err, pathnames) => {
      if (err) {
        console.log(err)
        response.writeHead(404)
        response.end(err.message)
      } else {
        response.writeHead(200, {
          'Content-Type': urlInfo.mime
        })
        outputFiles(pathnames, response)
      }
    })
  }).listen(port, function(err) {
    if (err) {
      console.log(err)
      return
    }
    console.log(`a server has running at port: ${port}\n`)
  })
  process.on('SIGTERM', function() {
    server.close(function() { // 关闭服务器
      process.exit(0) // 进程退出
    })
  })
}

function outputFiles(pathnames, writer) {
  (function next(i, len){
    if (i < len) {
      let reader = fs.createReadStream(pathnames[i]);
      reader.pipe(writer, {end: false})
      reader.on('end', () => {
        next(i + 1, len)
      })
    } else {
      writer.end()
    }
  }(0, pathnames.length))
}

function validataUrl(pathnames, callback) { // 验证url合法性
  (function next(i, len){
    if (i < len) {
      fs.stat(pathnames[i], (err, stats) => {
        if (err) {
          callback(err)
        } else if (!stats.isFile()) {
          callback(new Error(pathnames[i] + 'can not read file'))
        } else {
          next(i + 1, len)
        }
      })
    } else {
      callback(null, pathnames)
    }
  }(0, pathnames.length))
}

function parseUrl(root, url) {
  let base, parts, pathnames
  if (url.indexOf('??') === -1) {
    url = url.replace('/', '/??')
  }
  parts = url.split('??')
  base = parts[0]
  pathnames = parts[1].split(',').map((pathItem) => {
    return path.join(root, base, pathItem)
  })
  return {
    mime: MIME[path.extname(pathnames[0])] || 'text/plain',
    pathnames
  }
}
main(process.argv.slice(2))