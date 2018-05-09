# koa2学习

标签（空格分隔）： 笔记整理

---
## 异步流程控制演变
### 回调
```javascript
  function fn(cb) {
    try{
      ../
    }catch(err){
      cb(err)
    }
    cb(null, data)
  }
```
### promise
```javascript
  cosnt readFile = util.promisify(fs.readFile)
  readFile('./package.json')
  .then(data => {
    data = json.parse(data)
    console.log(data)
  })
  .catch(err => {
    console.log(err)
  })
```

### co库 + generator + promise
通过生成器断点控制 自动执行 同步的方式书写异步代码
```javascript
  co(function *(){
    cosnt readFile = util.promisify(fs.readFile)
    const data = yield readFile('./package.json')
    console.log(json.parse(data))
  })
```

### async/await + promise
co库的规范化
```javascript
  async function init() {
    cosnt readFile = util.promisify(fs.readFile)
    const data = await readFile('./package.json')
    console.log(json.parse(data))
  }
  init()
```

## import/export require/exports
### 区别
ES6 模块的设计思想，是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。
Require是CommonJS的语法，CommonJS的模块是对象，输入时必须查找对象属性。
```javascript
  // CommonJS模块
  let { stat, exists, readFile } = require('fs');

  // 等同于
  let _fs = require('fs');
  let stat = _fs.stat;
  let exists = _fs.exists;
  let readfile = _fs.readfile;
```
整体加载fs模块（即加载fs所有方法），生成一个对象_fs，然后再从这个对象上读取三个方法，这叫运行时加载，因为只有运行时才能得到这个对象，不能在编译时做到静态化。

ES6模块不是对象，而是通过export命令显示指定输出代码，再通过import输入。
```javascript
  import { stat, exists, readFile } from 'fs';
```
从fs加载“stat, exists, readFile” 三个方法，其他方法不加载，
### 通过babel编辑让Node开发环境中支持import export
安装依赖
```javascript
 npm i babel-cli babel-presets-env -D // balbel
 npm i nodemon -S  // 监控目录
```
配置.babelrc
```javascript
{
  "presets": [
    [
      "env",
      {
        "targets":{
          "node": "current"
        }
      }
    ]
  ]
}
```
配置package.json script
```javascript
"scripts": {
  "dev": "nodemon -w src --exec \"babel-node src --presets env\""
}
```
然后npm run dev就可以正常运行
### babel编译打包配置
安装依赖
```javascript
  npm - rimraf -D  (每次打包dist都能删除前一个)
```
脚本配置
```javascript
  "script": {
    "dev" : "nodemon -w src --exec \"babel-node src --presets env\"",
    "build": "rimraf dist && babel src -s -D -d dist --presets env"
  }
```
代码用到了async等es7语法特性，编译打包后无法使用， 原因是babel默认支持es6的编译
安装babel-runtime babel-plugin-tranform-run-time
安装依赖
```javascript
  npm i -S babel-plugin-tranform-run-time babel-runtime
```
配置babel插件
```javascript
  "plugin": [
    [
      "transform-runtime",
      {
        "polyfill": false,
        "regenerator": true
      }
    ]
  ]
```
## koa源码通读
application模块

依赖
```javascript
  const isGeneratorFunction = require('is-generator-function');
  const debug = require('debug')('koa:application'); // 轻量级的js调试
  const onFinished = require('on-finished'); // 事件监听 当请求出错或完成
  const response = require('./response'); // 处理响应
  const compose = require('koa-compose'); // 中间件含入数组
  const isJSON = require('koa-is-json');  // 判断是否为json
  const context = require('./context');  // 上下文
  const request = require('./request'); // 处理请求
  const statuses = require('statuses'); // 处理状态码
  const Cookies = require('cookies'); // 处理Cookies
  const accepts = require('accepts'); // 约定哪些数据可以被服务端接受
  const Emitter = require('events'); // 事件模块
  const assert = require('assert'); // 断言模块
  const Stream = require('stream'); // 流模块
  const http = require('http'); //  重度依赖的http模块
  const only = require('only'); // 白名单选择 把对象的某个key选出来
  const convert = require('koa-convert'); // 老旧版本兼容
  const deprecate = require('depd')('koa'); // 过期的模块提醒升级
```
使用koa2开启一个服务器
```javascript
  const koa = require('koa')
  const app = new koa()

  app.use(async (ctx, next) => {
    ctx.body = 'hello world'
  })

  app.listen(8080)
```
问题：
- new koa()做了些什么
- app.use 做了些什么
- app.listen 做了些什么
- 为什么app.use()传入的是一个async函数
- async函数里面 ctx, next 代表什么

Application类
```javascript
  class Application extends Emitter // 继承自Emitter 可以订阅分发事件
  
  constructor() { // 所以new koa() 默认继承了以下属性
    super();

    this.proxy = false;
    this.middleware = [];
    this.subdomainOffset = 2;
    this.env = process.env.NODE_ENV || 'development';
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }
  
  
  use(fn) { // use方法核心就是把传入的async函数push到中间件数组
    this.middleware.push(fn);
    return this;
  }
  
  
  listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback()); // 调用callback返回handleRequest
    return server.listen(...args);
  }
  
  
  callback() {
    const fn = compose(this.middleware); 
    // compose
    // 处理中间件函数
    // 返回一个可以依次执行中间件函数的函数
    // return function (context, next) {
    //   // last called middleware #
    //   let index = -1
    //   return dispatch(0)
    //   function dispatch (i) {
    //     if (i <= index) return Promise.reject(new Error('next() called multiple times'))
    //     index = i
    //     let fn = middleware[i]
    //     if (i === middleware.length) fn = next
    //     if (!fn) return Promise.resolve()
    //     try {
    //       return Promise.resolve(fn(context, function next () {
    //         return dispatch(i + 1)
    //       }))
    //     } catch (err) {
    //       return Promise.reject(err)
    //     }
    //   }
    // }

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res); // ctx供上下游使用
      return this.handleRequest(ctx, fn); // 真正处理请求和响应的函数
    };

    return handleRequest;
  }
  
  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    const handleResponse = () => respond(ctx);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror); // 执行中间件函数并且处理返回
  }
  
  
  createContext(req, res) {
    // 就是创建context 把 request respond 信息写入
    // 并且同样把写好的context挂在在requeset respond上
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.cookies = new Cookies(req, res, {
      keys: this.keys,
      secure: request.secure
    });
    request.ip = request.ips[0] || req.socket.remoteAddress || '';
    context.accept = request.accept = accepts(req);
    context.state = {};
    return context;
  }
  
  // respond函数
  // 判断body类型 决定返回方式
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);
```
所有整个application的能力就是
- new koa() 生成application对象注入env，middleware callback listen等并且继承自Emiter方法和属性
- app.use(fn) 加载中间件 （向middleware push fn)
- app.listen ctx生成 开启服务器监听端口 等待请求 => 请求 => handleRequest => 处理中间件函数 => 处理返回


context模块
返回一个集合request,respond属性方法的对象
context模块核心在于delegate模块
```javascript
 delegate(proto, 'response') // 把response 的方法挂到proto对象上
  .method('attachment')
  .method('redirect')
  .method('remove')
  .method('vary')
  .method('set')
  .method('append')
  .method('flushHeaders')
  .access('status')
  .access('message')
```

request模块
暴露出的某些属性的getter setter
定义某些可以访问修改的属性和方法
```javascript
  get url() {
    return this.req.url;
  },
  set url(val) {
    this.req.url = val;
  }
```

response模块
与requeset模块类似， 里面暴露出一些可以访问或者修改的属性和方法
```javascript
  get body() {
    return this._body;
  },
  
  set body(val) {
    const original = this._body;
    this._body = val;

    // no content
    if (null == val) {
      if (!statuses.empty[this.status]) this.status = 204;
      this.remove('Content-Type');
      this.remove('Content-Length');
      this.remove('Transfer-Encoding');
      return;
    }

    // set the status
    if (!this._explicitStatus) this.status = 200; // 响应体初始化

    // set the content-type only if not yet set
    const setType = !this.header['content-type'];

    // string
    if ('string' == typeof val) {       // 根据val的类型配置相关属性
      if (setType) this.type = /^\s*</.test(val) ? 'html' : 'text';
      this.length = Buffer.byteLength(val);
      return;
    }

    // buffer
    if (Buffer.isBuffer(val)) {
      if (setType) this.type = 'bin';
      this.length = val.length;
      return;
    }

    // stream
    if ('function' == typeof val.pipe) {
      onFinish(this.res, destroy.bind(null, val));
      ensureErrorHandler(val, err => this.ctx.onerror(err));

      // overwriting
      if (null != original && original != val) this.remove('Content-Length');

      if (setType) this.type = 'bin';
      return;
    }

    // json
    this.remove('Content-Length');
    this.type = 'json';
  }
  
  
  vary(field) { // 响应的内容不是常规的accept 需要定义vary字段 并且vary字段有agent
    if (this.headerSent) return;

    vary(this.res, field);
  },
  
  
  set lastModified(val) { // 修改文件最后一次更新时间 通常用于通知客服端不需要再使用缓存
    if ('string' == typeof val) val = new Date(val);
    this.set('Last-Modified', val.toUTCString());
  },
  
  set etag(val) { // 通常配合lastModified使用 如有些文件需要周期性修改 
    if (!/^(W\/)?"/.test(val)) val = `"${val}"`;
    this.set('ETag', val);
  },
```

中间件middlewares

多个中间依次执行
```javascript
  const koa = require('koa')
  const app = new koa()

  const mid1 = async (ctx, next) => {
    ctx.type = 'text/html; charset=utf-8'
    await next()
  }

  const mid2 = async (ctx, next) => {
    ctx.body = 'Hi'
    await next()
  }

  const mid3 = async (ctx, next) => {
    ctx.body = ctx.body + ' Forrest'
    // awit next()
  }

  app.use(mid1)
  app.use(mid2)
  app.use(mid3)

  app.listen(8080, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('A Server Running at port 8080')
    }
  })
  
  // 最后输出 Hi Forrest 并且是text/html
```
还可以通过next调整执行顺序
```javascript
  const mid1 = async (ctx, next) => {
    ctx.body = 'text start:'
    await next()
    ctx.body = ctx.body + ' where am i'
  }

  const mid2 = async (ctx, next) => {
    ctx.type = 'text/html; charset=utf-8'
    ctx.body = ctx.body + 'Hi'
    await next()
  }

  const mid3 = async (ctx, next) => {
    ctx.body = ctx.body + ' Forrest'
    // awit next()
  }
  // 最后输出的是 'text start: Hi Forrest where am i'
```
通过next可以交出控制权, 调整中间件的执行过程
通过async/await 即使中间件需要执行异步操作 执行顺序也能够很好的控制 (并且以同步代码的方式书写)

栗子：使用koa-logger中间件
```javascript
  npm i koa-logger -S
  
  // server.js
  const logger = require('koa-logger')
  
  app.use(logger())
  
  // 查看koa-logger源码
  // index.js
  // module.exports = dev
  // dev 执行 返回 一个 async函数
```

koa-compose模块分析
koa-compose用于管理中间件，传入中间件数组，返回一个可递归执行中间件函数的函数
且暴露出next方法可以控制执行流程
```javascript
  // koa-compose 核心源码
  return function (context, next) {
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      // if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      // if (i === middleware.length) fn = next
      // if (!fn) return Promise.resolve()
      return Promise.resolve(fn(context, function next () {
        return dispatch(i + 1)
      }))
    }
  }
```
尾递归与纯函数

纯函数

一个函数的返回结果只依赖于它的参数，并且在执行过程里面没有副作用，我们就把这个函数叫做纯函数。
```javascript
  funtion pure(i) {
    return i + 1
  }
  pure(1)
  pure(2)
  pure(3)
```
尾递归

尾递归的判断标准是函数运行最后一步是否调用自身，而不是是否在函数的最后一行调用自身
```javascript
  // 非尾递归
  function factorial(n) {
   if (n === 1) return 1;
   return n * factorial(n-1); // 最后一步不是调用自身，因此不是尾递归
  }
  // 尾递归
  function factorial(n, total) {
    if (n === 1) return total;
    return factorial(n - 1, n * total);
  }
```
尾递归的好处就是, 里层调用不要依赖外层caller环境, 调用的时候可以直接覆盖原有的栈，而不是像普通
递归一样，新开一个栈，从而节约消耗
参考
> http://www.ruanyifeng.com/blog/2015/04/tail-call.html

koa-compose分析
```javascript
  // dispatch(0)调用
  
  // 执行 middlewares[0] 并返回一个promise
  return Promise.resolve(fn(context, function next () {
    return dispatch(i + 1)
  }))
  // next 控制下一个中间件执行 
  // next 暴露出给中间件函数的第二个参数, 从而可以控制下一个中间件函数执行
  
  // dispatch就是纯函数 
  // 且里面用到的就是尾递归
```