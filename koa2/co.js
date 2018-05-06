const co = require('co')
const fetch = require('node-fetch')

// co(function *() {
//   const res = yield fetch('https://api.douban.com/v2/movie/1291843')
//   const movie  = yield res.json()
//   const summary = movie.summary;
//   console.log(summary)
// })

function run(gen) {
  const iterator = gen()
  const it = iterator.next()
  const promise = it.value
  
  Promise.resolve(promise).then(data => {
    const it2 = iterator.next(data)
    const promise2 = it2.value
    
    Promise.resolve(promise2).then(data => {
      iterator.next(data)
    })
  })
}

run(function *() {
  const res = yield fetch('https://api.douban.com/v2/movie/1291843')
  const movie  = yield res.json()
  const summary = movie.summary;
  console.log(summary)
})