// console.log(process.stdin)
let body = []
process.stdin.on('data', function(chunk) {
  body.push(chunk)
})
process.stdin.on('end', function() {
  body = Buffer.concat(body)
  console.log(body.toString())
})

process.stdout.write('write stdout')