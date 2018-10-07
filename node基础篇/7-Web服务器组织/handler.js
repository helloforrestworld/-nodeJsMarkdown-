const fs = require('fs')

function home(request, response) {
  console.log('excuting home handler')
  response.writeHead(200, { 'Content-Type': 'text/html ' })
  const readStream = fs.createReadStream(__dirname + '/pages/home.html')
  readStream.pipe(response)
}

function preview(request, response) {
  console.log('excuting preview handler')
  response.writeHead(200, { 'Content-Type': 'text/html ' })
  const readStream = fs.createReadStream(__dirname + '/pages/preview.html')
  readStream.pipe(response)
}

function api_records(request, response) {
  const json = {
    name: 'xiaoming'
  }
  response.writeHead(200, { 'Content-Type': 'application/json ' })
  response.end(JSON.stringify(json))
}

function not_found(request, response) {
  console.log('excuting not_found handler')
  response.writeHead(200, { 'Content-Type': 'text/html ' })
  const readStream = fs.createReadStream(__dirname + '/pages/404.html')
  readStream.pipe(response)
}

module.exports = {
  '/home': home,
  '/preview': preview,
  '/api/v1/records': api_records,
  not_found: not_found
}
