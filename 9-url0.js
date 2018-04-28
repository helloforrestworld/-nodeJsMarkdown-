const href = 'http://baidu.com/foo/bar?ab=1#aj=&&22'
const url = require('url')
console.log(url.resolve(href, '/ak'))