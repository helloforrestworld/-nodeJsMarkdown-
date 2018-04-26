let buf = new Buffer([0x83, 0x65, 0x64, 0x72])
let bufslice = buf.slice(1)
console.log(buf, bufslice)
// <Buffer 83 65 64 72>
// <Buffer 65 64 72>
bufslice[0] = 0x99
console.log(buf, bufslice)
// <Buffer 83 99 64 72>
// <Buffer 99 64 72>
// Buffer与字符串有一个重要区别。字符串是只读的，并且对字符串的任何修改得到的都是一个新字符串，原字符串保持不变。至于Buffer，更像是可以做指针操作的C语言数组。例如，可以用[index]方式直接修改某个位置的字节。
// 而.slice方法也不是返回一个新的Buffer，而更像是返回了指向原Buffer中间的某个位置的指针，