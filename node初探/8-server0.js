const http = require('http')
http.createServer((req, res) => {
  let body = []
  // console.log(req.headers)
  req.on('data', function(chunk) {
    console.log(chunk)
  })
  req.on('end', () => {
    console.log(body)
    body = Buffer.concat(body)
    console.log(body)
    console.log(body.toString())
  })
  res.writeHead(200, {'Content-Type':'text-plain'})
  res.end('Hello,World\n')
}).listen(8080, (err) => {
  if(err) {
    console.log(err)
    return
  }
  console.log('a server has running at localhost:8080\n')
})