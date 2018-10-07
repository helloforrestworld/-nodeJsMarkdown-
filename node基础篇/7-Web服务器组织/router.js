const handler = require('./handler.js')

function route(request, response) {
  const pathname = request.url
  if (typeof handler[pathname] === 'function') {
    handler[pathname](request, response)
  } else {
    handler['not_found'](request, response)
  }
}

module.exports.route = route
