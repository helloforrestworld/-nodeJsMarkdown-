const http = require('http')
const fs = require('fs')

function start(route) {
  // 响应处理
  const responseHandler = (request, response) => {
    console.log('request receive ' + request.url)
    // 路由处理
    route(request, response)
  }

  // 创建服务器
  const server = http.createServer(responseHandler)

  // 监听窗口
  server.listen(3000, err => {
    console.log('A Server has been started at localhost port 3000！')
  })
}

exports.start = start
