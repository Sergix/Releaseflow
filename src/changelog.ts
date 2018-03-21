import * as config from './config'
import * as regexp from './regexp'
import * as util from './util'
import * as fs from 'fs'

export let current: Array<string> = []

export function get(): Array<string> {
  // TODO
  // Add "ignore" option for lines in
  // rfconfig

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

  data[data.length] = line.trim()
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

    data[data.length] = (!x[i].trim().startsWith('-') ? '- ' : '') + (config.data.changelog.replace_links ? util.replacer(x[i], {'links': true}) : x[i])
  }

  return data
}

export function release(file: boolean = true): void {
  current = match(get())

  if (file) {
    fs.writeFileSync(
      config.data.changelog.dist + 'changelog-' + config.projectPackage.version + '.' + (config.data.markdown ? 'md' : 'txt'),
      util.stringify(current)
    )
  }
}