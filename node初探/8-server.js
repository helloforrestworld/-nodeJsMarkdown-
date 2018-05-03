const http = require('http')
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type':'text-plain'})
  res.end('Hello,World\n')
}).listen(8080, (err) => {
  if(err) {
    console.log(err)
    return
  }
  console.log('a server has running at localhost:8080\n')
})