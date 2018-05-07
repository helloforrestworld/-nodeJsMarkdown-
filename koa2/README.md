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
    const server = http.createServer(this.callback()); // 调用http模块 创建应用 传入处理后的callback
    return server.listen(...args);
  }
  
```