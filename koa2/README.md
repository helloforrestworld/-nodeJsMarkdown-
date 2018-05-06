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

