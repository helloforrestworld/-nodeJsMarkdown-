const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)

async function init() {
  try{
    let data = await readFile('./package.json')
    console.log(JSON.parse(data))
  }catch(err) {
    console.log(err)
  }
}

init()