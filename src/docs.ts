import * as program from './program'
import * as changelog from './changelog'
import * as config from './config'
import * as fs from 'fs'
import * as colors from 'colors'
import { replacer, nl, stringify, filenameHandler } from './util'
import { isObject } from 'util'
import { rfconfig, projectPackage } from './config'

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

  output += ` ${replacer(text, {interpolate: true})}` + nl

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
      contents.push(replacer(x[y], {interpolate: true}))
      contents.push(nl)
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
      toc += `${t}. ${y}  ` + nl
      t++
    }
  }
}

export default function release(): void {
  const ext: string = rfconfig.markdown ? 'md' : 'txt'
  let filename = replacer(rfconfig.docs.dist, {interpolate: true})

  title(rfconfig.docs.title + nl)

  buildToc(rfconfig.docs.template)
  build(rfconfig.docs.template)

  filename = filenameHandler(filename, ext, 'docs', 'documentation')

  // Write the doc contents to the file!
  fs.writeFile(filename, stringify(contents), (err) => {
    if (!err) {
      console.info(colors.green('Finished writing documentation. Wrote to'), colors.bgGreen.white(`${filename}`))
    } else {
      console.error(colors.red('ERROR: Failed to create documentation at'), colors.red.underline(`${filename}`), colors.red('. Perhaps the directory doesn\'t exist?'))
    }
  })
}