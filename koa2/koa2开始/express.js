const express = require('express')
const app = express()

function indent(n) {
  return new Array(n).join('&nbsp')
}

const mid1 = () => {
  return  (req, res, next) => {
    res.body += `<h2 style="color:red">请求 =>${indent(2)}第一层中间件</h2> `
    next()
    res.body +=  `<h2 style="color:red">响应 <=${indent(2)}第一层中间件</h2> `
  }
}

const mid2 = () => {
  return  (req, res, next) => {
    res.body += `<h2 style="color:red">请求 =>${indent(2)}第二层中间件</h2> `
    next()
    res.body +=  `<h2 style="color:red">响应 <=${indent(2)}第二层中间件</h2> `
  }
}

const mid3 = () => {
  return  (req, res, next) => {
    res.body += `<h2 style="color:red">请求 =>${indent(2)}第三层中间件</h2> `
    next()
    res.body +=  `<h2 style="color:red">响应 <=${indent(2)}第三层中间件</h2> `
  }
}

app.use(mid1())
app.use(mid2())
app.use(mid3())
app.get('/', (req, res) => {
  res.send(res.body + `<h1>${indent(12)} <= &nbsp 处理核心业务 &nbsp =></h1>`)
})

app.listen(8080)