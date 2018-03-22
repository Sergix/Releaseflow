import * as config from './config'
import * as regexp from './regexp'
import * as util from './util'
import * as colors from 'colors'
import * as fs from 'fs'

export let current: Array<string> = []

export function get(): Array<string> {
  const data: Array<string> = []
  const fileContents: string = fs.readFileSync(config.data.changelog.path).toString()
  let line: string = ''

  for (let i = 0; i < fileContents.length; i++) {
    if (fileContents[i] === '\n') {
      config.data.changelog.ignore.forEach((x: string) => {
        if (x !== line.trim()) // if we need to ignore the line
          data[data.length] = line.trim()
      })
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

  let filename = util.replacer(config.data.changelog.dist, {interpolate: true})

  // Get the file extension
  const ext = config.data.markdown ? 'md' : 'txt'

  // Replace the interpolater indentifier '%e' with the file extension
  filename.replace(/%e/, ext)

  // If the path is a directory, check if it ends with a '/' and append a default string along with
  // the version number if available; otherwise, slap a timestamp on the filename as the fallback to make sure
  // we don't overwrite any existing files, as well as provide a warning.
  if (fs.statSync(filename).isDirectory()) {
    if (!filename.endsWith('/') && !filename.endsWith('\\')) {
      filename += '/'
    }
    filename += 'changelog-' + 
      (config.projectPackage.version !== undefined && config.projectPackage.version !== null ? 
        config.projectPackage.version :
        (console.info(colors.yellow('WARNING: No version number found in package file. A timestamp will be used in the changelog filename.')), Date.now().toString())
      )
  }

  if (file) {
    fs.writeFileSync(
      filename,
      util.stringify(current)
    )
  }
}