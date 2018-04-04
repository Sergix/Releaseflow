import * as regexp from './regexp'
import * as util from './util'
import * as colors from 'colors'
import * as fs from 'fs'
import { rfconfig, projectPackage } from './config'

export let current: Array<string> = []

export function get(): Array<string> {
  const data: Array<string> = []
  const fileContents: string = fs.readFileSync(rfconfig.changelog.path).toString()
  let line: string = ''

  for (let i = 0; i < fileContents.length; i++) {
    if (fileContents[i] === '\n') {
      rfconfig.changelog.ignore.forEach((x: string) => {
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
  const testString: string = regexp.replacer(rfconfig.changelog.header_format)
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

    data[data.length] = (!x[i].trim().startsWith('-') ? '- ' : '') + (rfconfig.changelog.replace_links ? util.replacer(x[i], {'links': true}) : x[i])
  }

  return data
}

export function release(file: boolean = true): void {
  const ext: string = rfconfig.markdown ? 'md' : 'txt'
  let isDir: boolean = false
  let filename: string = util.replacer(rfconfig.changelog.dist, {interpolate: true})
  current = match(get())

  // check if the file exists
  try {
    fs.accessSync(filename, fs.constants.F_OK)
    isDir = false
  } catch (err) {
    // check if its a directory
    try {
      fs.statSync(filename).isDirectory()
      isDir = true
    } catch (err) {
      isDir = false
    }
  }

  // if it's a directory, use the default changelog filename
  if (isDir) {
    if (!filename.endsWith('/') && !filename.endsWith('\\')) {
      filename += '/'
    }
    filename += 'changelog-' +
      (projectPackage.version !== undefined && projectPackage.version !== null ?
        projectPackage.version :
        (console.info(colors.yellow('WARNING: No version number found in package file. A timestamp will be used in the changelog filename.')), Date.now().toString())
      ) + '.' + ext
  }

  // Write the contents to the file!
  fs.writeFile(filename, util.stringify(current), (err) => {
    if (!err) {
      console.info(colors.green('Finished writing changelog. Wrote to'), colors.bgGreen.white(`${filename}`))
    } else {
      console.error(colors.red('ERROR: Failed to create changelog at'), colors.red.underline(`${filename}`), colors.red('. Perhaps the directory doesn\'t exist?'))
    }
  })
}