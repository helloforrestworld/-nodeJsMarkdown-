// const fn = function fn() {}
// const fn1 = (fn) => {}
// const fn1 = fn => {}
// const fn1 = fn => console.log(fn)
// const fn1 = fn => ({a:fn})
// const fn1 = ({id, mo}) => {
//   console.log(id, mo)
// }

// 另外 箭头函数的this指向被定义时执行环境的this


const a = {
  fn1: () => {
    console.log(this)
  },
  fn2: function() {
    console.log(this)
  }
}
a.fn1() //windows
a.fn2() // a
