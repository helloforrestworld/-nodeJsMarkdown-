let { EventEmitter } = require('events')
let { inherits } = require('util')

function Person(name) {
  this.name = name
}

// 继承EventEmitter
inherits(Person, EventEmitter)

let somePersons = ['lili', 'gigi', 'bili']
let someInstance = somePersons.map(name => {
  let instance = new Person(name)
  // 订阅事件
  instance.on('speak', message => {
    console.log(name + ' say: ' + message)
  })
  return instance
})

// 发布事件
someInstance[2].emit('speak', 'i am ' + someInstance[2].name)
