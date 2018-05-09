var koa = require('koa')
var app = new koa()
var logger = require('koa-logger')

app.use(logger())

function indent(n) {
  return new Array(n).join('&nbsp')
}

var mid1 = function() {
  return function *(next){
    this.type = 'text/html;charset=utf-8'
    this.body += '<h2 style="color:red">请求 =>' + indent(2) + '第一层中间件</h2> '
    console.log(next)
    yield next
    this.body +=  '<h2 style="color:red">响应 <=' + indent(2) + '第一层中间件</h2> '
  }
}

var mid2 = function() {
  return function *(next){
    this.body += '<h2 style="color:red">请求 =>' + indent(4) + '第二层中间件</h2> '
    yield next
    this.body +=  '<h2 style="color:red">响应 <=' + indent(4) + '第二层中间件</h2> '
  }
}

var mid3 = function() {
  return function *(next){
    this.body += '<h2 style="color:red">请求 =>' + indent(8) + '第三层中间件</h2> '
    yield next
    this.body +=  '<h2 style="color:red">响应 <=' + indent(8) + '第三层中间件</h2> '
  }
}

app.use(mid1())
app.use(mid2())
app.use(mid3())
app.use(function *(next) {
  this.body +=  '<h1>'+ indent(12) +'<= &nbsp 处理核心业务 &nbsp =></h1> '
})

app.listen(8080)