const session = require('koa-session')
const koa = require('koa')
const app = new koa()
const logger = require('koa-logger')

app.use(logger())
app.use(session(app));
app.keys = ['view time'];

// app.use(ctx => {
//   // ignore favicon
//   if (ctx.path === '/favicon.ico') return;
// 
//   let n = ctx.session.views || 0;
//   ctx.session.views = ++n;
//   ctx.body = n + ' views';
// });

app.use(async ctx => {
  ctx.type = 'text/html charset=utf-8'
  if (ctx.path === '/name') {
    ctx.body = 'Forrest'
    return
  }
  if (ctx.path === '/age') {
    ctx.body = '18'
    return
  }
  
  if (ctx.path === '/favicon.ico') return;
  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  ctx.body = n + ' views';
})

app.listen(8080)