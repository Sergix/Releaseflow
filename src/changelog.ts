import * as config from './config'
import * as regexp from './regexp'
import replacer from './replacer'
import * as fs from 'fs'

export let current: Array<string> = []

export function get(): Array<string> {
  const data = []
  const fileContents: string = fs.readFileSync(config.data.changelog.path).toString()
  let line: string = ''

  for (let i = 0; i < fileContents.length; i++) {
    if (fileContents[i] === '\n') {
      data[data.length] = line.trim()
      line = ''
      continue
    }

    if (fileContents[i] !== '\r') { // skip return carriage
      line += fileContents[i]
    }
  }

  return data
}

export function match(x: Array<string>): Array<string> {
  const data = []
  const testString: string = regexp.replacer(config.data.changelog.header_format)
  const regex: RegExp = new RegExp(testString)
  let flag: boolean = false

  for (let i = 0; i < x.length; i++) {
    if (!flag) { // if we are not currently reading an entry
      if (regex.test(x[i])) { // if the string matches the header format
        flag = true
      }
      continue
    }

    if (x[i] === '\n' || x[i] === '') { // if the data is a newline, it is the end of entry
      flag = false
      continue
    }

    data[data.length] = x[i]
  }

  return data
}

export default function release(): void {
  current = match(get())

  if (config.data.changelog.replace_links) {

    let i = 0
    current.forEach(line => {
      console.log('release', line, current)
      current[i] = replacer(line, {'links': true})
      i++
    })
  }
}