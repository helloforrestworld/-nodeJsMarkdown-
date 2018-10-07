const handler = require('./handler.js')
const url = require('url')
const qs = require('querystring')

function route(request, response) {
  let { pathname, query } = url.parse(request.url, true)
  pathname = pathname === '/' ? '/home' : pathname

  if (typeof handler[pathname] === 'function') {
    // let data = ''
    let data = []

    request
      .on('error', err => {
        console.log(err)
      })
      .on('data', chunk => {
        // data += chunk
        data.push(chunk)
      })
      .on('end', () => {
        if (request.method.toUpperCase() === 'POST') {
          data = Buffer.concat(data).toString()
          if (data.length > 1e6) {
            request.connection.destroy()
          }
          data = qs.parse(data)
        } else {
          data = query
        }
        handler[pathname](data, response)
      })
  } else {
    handler['not_found'](request, response)
  }
}

module.exports.route = route
