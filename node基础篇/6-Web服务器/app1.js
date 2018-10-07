const http = require('http')

// 创建服务器
const server = http.createServer((request, response) => {
  console.log('request receive')
  response.writeHead(200, { 'Content-Type': 'text/plain' })

  // response.write('this is a response text')
  // response.end()

  response.end('this is a response text')
})

// 监听窗口
server.listen(3000, err => {
  console.log('A Server has been started at localhost port 3000！')
})
