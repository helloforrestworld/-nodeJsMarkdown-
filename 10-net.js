let net = require('net')
net.createServer(function(conn) {
  conn.on('data', function(data) {
    conn.write([
      'HTTP/1.1 200 OK',
      'Content-Type: text/plain',
      'Content-Length: 11',
      '',
      'Hello World'
    ].join('\n'))
  })
}).listen(80, function(err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('server running at port 80 \n')
})