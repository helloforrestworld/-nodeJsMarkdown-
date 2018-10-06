const counter = arr => {
  return `there are ${arr.length} ele in arr`
}

const add = (num1, num2) => {
  return `the sums of two number is ${num1 + num2}`
}

const pi = 3.14

// module.exports.counter = counter
// module.exports.add = add
// module.exports.pi = pi

// module.exports = {
//   counter,
//   add,
//   pi
// }

exports.counter = counter
exports.add = add
exports.pi = pi

/* error */
// exports = {
//   counter,
//   add,
//   pi
// }
