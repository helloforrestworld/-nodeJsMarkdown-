
function createIterator(arr) {
  let index = 0;
  return {
    next() {
      if (index < arr.length) {
        return {value: arr[index ++], done: false}
      } else {
        return {done: true}
      }
    }
  }
}

// it就是一个迭代器
let it = createIterator(['吃饭', '嘿嘿', '工作'])

console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())

// 生成器genarator * 就是更方便生成  迭代器的工具

function *gen(arr) {
  for (let i = 0; i < arr.length; i++) {
    yield arr[i]
  }
}

let it2 = gen(['嘿嘿', '吃饭', '打豆豆'])
console.log(it2.next())
console.log(it2.next())
console.log(it2.next())
console.log(it2.next())
console.log(it2.next())
