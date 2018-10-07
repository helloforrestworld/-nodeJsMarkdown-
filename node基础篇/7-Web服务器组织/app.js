// 入口文件
const { start } = require('./server.js')
const { route } = require('./router.js')

// 启动服务器
start(route)
