const http = require('http')
const options = {
  hostname: 'www.baidu.com',
  path: '/s',
  method: 'GET',
  headers: {
    host: 'www.baidu.com',
    referer: 'https://www.baidu.com'
  },
  query: {
    callback:'jQuery110204042071559741267_1524770543662',
    num:8,
    _req_seqid:'a06429ee00010bef',
    sid:'1429_21109_20698',
    _:1524770543663,
    wd: encodeURI('哈哈')
  }
}
let request = http.request(options, function(res) {
  console.log(res)
})
request.write('Hello World');
request.end();