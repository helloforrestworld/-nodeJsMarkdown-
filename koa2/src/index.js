import {resolve} from 'path'
import {readFile as read, writeFileSync as write} from 'fs'
import {promisify} from 'util'
// import * as qs from 'queryString'
const fetch = require('node-fetch')


promisify(read)(resolve(__dirname, '../package.json'))
.then(data => {
  data = JSON.parse(data)
  write(resolve(__dirname, './name'), String(data.name), 'utf-8')
})

async function init() {
  let data = await fetch('https://api.douban.com/v2/movie/1291843')
  let movie = await data.json()
  console.log(movie.summary)
}
init()
