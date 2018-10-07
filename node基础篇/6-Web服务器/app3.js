const http = require('http')
const fs = require('fs')

// 响应处理
const responseHandler = (request, response) => {
  console.log('request receive')
  response.writeHead(200, { 'Content-Type': 'text/html ' })
  const readStream = fs.createReadStream(__dirname + '/index.html')
  readStream.pipe(response)
}

// 创建服务器
const server = http.createServer(responseHandler)

// 监听窗口
server.listen(3000, err => {
  console.log('A Server has been started at localhost port 3000！')
})
