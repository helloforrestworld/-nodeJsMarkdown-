const koa = require('koa')
const app = new koa()

app.use(async (ctx, next) => {
  ctx.body = 'hello world'
})

app.listen(8080)

// ctx next是啥？
// async fn 为什么?
// new koa()做了什么
// app.listen 做了什么