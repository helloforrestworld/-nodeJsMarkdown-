const http = require('http')

const json = {
  name: 'sun',
  age: 18
}

// 响应处理
const responseHandler = (request, response) => {
  console.log('request receive')
  response.writeHead(200, { 'Content-Type': 'application/json ' })
  response.end(JSON.stringify(json))
}

// 创建服务器
const server = http.createServer(responseHandler)

// 监听窗口
server.listen(3000, err => {
  console.log('A Server has been started at localhost port 3000！')
})
