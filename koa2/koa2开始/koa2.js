const koa = require('koa')
const app = new koa()
const logger = require('koa-logger')
const convert = require('koa-convert')

app.use(convert(logger()))
// app.use(logger())
function indent(n) {
  return new Array(n).join('&nbsp')
}

const mid1 = () => {
  return async (ctx, next) => {
    ctx.type = 'text/html;charset=utf-8'
    ctx.body += `<h2 style="color:red">请求 =>${indent(2)}第一层中间件</h2> `
    await next()
    ctx.body +=  `<h2 style="color:red">响应 <=${indent(2)}第一层中间件</h2> `
  }
}

const mid2 = () => {
  return async (ctx, next) => {
    ctx.body += `<h2 style="color:red">请求 => ${indent(4)}第二层中间件</h2> `
    await next()
    ctx.body +=  `<h2 style="color:red">响应 <=${indent(4)}第二层中间件</h2> `
  }
}

const mid3 = () => {
  return async (ctx, next) => {
    ctx.body += `<h2 style="color:red">请求 =>${indent(8)}第三层中间件</h2> `
    await next()
    ctx.body +=  `<h2 style="color:red">响应 <=${indent(8)}第三层中间件</h2> `
  }
}

app.use(mid1())
app.use(mid2())
app.use(mid3())
app.use(async (ctx, next) => {
  ctx.body +=  `<h1>${indent(12)} <= &nbsp 处理核心业务 &nbsp =></h1>`
})

app.listen(8080)