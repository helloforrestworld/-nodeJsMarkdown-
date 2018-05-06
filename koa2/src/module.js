export const a = 1
export const fn = () => {
  console.log(1,2,3)
}
export default function df(){
  console.log('我可以默认导出')
}

const b = 3
const obj = {a: 1, b:3}

export {
  b as b1,
  obj as obj1
}