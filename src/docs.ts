import * as program from './program'
import * as changelog from './changelog'
import * as config from './config'
import * as fs from 'fs'
import * as colors from 'colors'
import * as util from './util'
import { isObject } from 'util'
import { rfconfig } from './config'

export let toc: string = ''

let bIndex: number = 1
let tIndex: number = 1
const contents: Array<string> = []

function title(text: string): void {
  let output: string = ''

  if (rfconfig.markdown) {
    for (let i = 0; i < bIndex; i++) {
      output += '#'
    }
  }

  output += ` ${util.replacer(text, {interpolate: true})}` + util.nl

  contents.push(output)
}

function build(x: any) {
  bIndex++
  for (const y in x) {
    if (isObject(x[y])) {
      title(y)
      build(x[y])
      bIndex--
    } else {
      title(y)
      if (!rfconfig.markdown) contents.push('----------------------')
      contents.push(util.replacer(x[y], {interpolate: true}))
      contents.push(util.nl)
    }
  }
}

function buildToc(x: any): void {
  let t: number = 1
  for (const y in x) {
    if (isObject(x[y])) {
      tIndex++
      buildToc(x[y])
      tIndex--
    } else {
      for (let i = 0; i < tIndex - 1; i++) {
        toc += '\t'
      }
      toc += `${t}. ${y}  ` + util.nl
      t++
    }
  }
}

export default function release(): void {
  const ext: string = rfconfig.markdown ? 'md' : 'txt'
  let filename = util.replacer(rfconfig.docs.dist, {interpolate: true})
  let isDir: boolean = false

  title(rfconfig.docs.title + util.nl)

  buildToc(rfconfig.docs.template)
  build(rfconfig.docs.template)

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
    filename += 'docs-' +
      (config.projectPackage.version !== undefined && config.projectPackage.version !== null ?
        config.projectPackage.version :
        (console.info(colors.yellow('WARNING: No version number found in package file. A timestamp will be used in the documentation filename.')), Date.now().toString())
      ) + '.' + ext
  }

  // Write the doc contents to the file!
  fs.writeFile(filename, util.stringify(contents), (err) => {
    if (!err) {
      console.info(colors.green('Finished writing documentation. Wrote to'), colors.bgGreen.white(`${filename}`))
    } else {
      console.error(colors.red('ERROR: Failed to create documentation at'), colors.red.underline(`${filename}`), colors.red('. Perhaps the directory doesn\'t exist?'))
    }
  })
}