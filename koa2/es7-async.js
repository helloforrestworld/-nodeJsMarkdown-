// 异步流程控制演变历史
// 回调函数
// function fn(cb) {
//   try{
//     ../
//   }catch(err){
//     cb(err)
//   }
//   cb(null, data)
// }

// promise
// cosnt readFile = util.promisify(fs.readFile)
// readFile('./package.json')
// .then(data => {
//   data = json.parse(data)
//   console.log(data)
// })
// .catch(err => {
//   console.log(err)
// })

// co库 + generator + promise
// co(function *(){
//   cosnt readFile = util.promisify(fs.readFile)
//   const data = yield readFile('./package.json')
//   console.log(json.parse(data))
// })

// async/await + promise
// async function init() {
//   cosnt readFile = util.promisify(fs.readFile)
//   const data = await readFile('./package.json')
//   console.log(json.parse(data))
// }
// init()