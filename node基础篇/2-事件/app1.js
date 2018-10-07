let events = require('events')

let myEmitter = new events.EventEmitter()

myEmitter.on('someEvent', info => {
  console.log(info)
})

myEmitter.emit('someEvent', '触发事件')
