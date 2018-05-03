const http = require('http')
const path = require('path')
const fs = require('fs')

const MIME = {
  '.css': 'text/css',
  '.js': 'application/javascript'
}

function combineFiles(pathnames, callback) {
  let output = [];
  (function next(i, len){
    if (i < len) {
      fs.readFile(pathnames[i], (err, data) => {
        if (err) {
          callback(err)
        } else {
          output.push(data)
          next(i + 1, len)
        }
      })
    } else {
      callback(null, Buffer.concat(output))
    }
  }(0, pathnames.length));
}

function main(argv) {
  let config = JSON.parse(fs.readFileSync(argv[0], 'utf-8'))
  let port = config.port || 80
  let root = config.root || '.'
  http.createServer(function(request, response) {
    let url = request.url
    let urlInfo = parseUrl(root, url)
    combineFiles(urlInfo.pathnames, (err, data) => {
      if (err) {
        response.writeHead(404)
        response.end(err.message)
      } else {
        response.writeHead(200, {
          'Content-Type': urlInfo.mime
        })
        response.end(data)
      }
    })
  }).listen(port, function(err) {
    if (err) {
      console.log(err)
      return
    }
    console.log(`a server has running at port: ${port}\n`)
  })
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