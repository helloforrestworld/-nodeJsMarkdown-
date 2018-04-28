// const href = '/foo/bar?ab=1#aj=&&22'
const url = require('url')
console.log(url.parse(href))
console.log(url.parse(href, true))

const href1 = '//example.com/foo/bar?ss=1'
console.log(url.parse(href1))
console.log(url.parse(href1, true, true))