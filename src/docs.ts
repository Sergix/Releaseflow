import * as program from './program'
import * as changelog from './changelog'
import * as config from './config'
import * as fs from 'fs'
import * as colors from 'colors'
import * as util from './util'

export let toc: string = ''

function generateToc(): void {
  let i = 1
  // loop through each tempalate section
  for (const x in config.data.docs.template) {
    // (i)      (x)
    //  1. Section Title
    toc += `${i}. ${x}\r\n`
    i++
  }
}

export function build(): Array<string> {
  const data: Array<string> = []

  // go ahead and generate the table of contents in case we need it later
  generateToc()

  // add the document title
  data.push((config.data.markdown ? '# ' : '') + util.replacer(config.data.docs.title, {interpolate: true}) + '\r\n\r\n')

  // TODO
  // add subsections by checking if the section is an object rather than a string
  // recursiveness will really come in handy

  // loop through each section
  for (const x in config.data.docs.template) {
    // add the section title
    data.push((config.data.markdown ? '## ' : '') + `${x}\r\n`)
    // if we're not writing in markdown, add a little section underline
    if (!config.data.markdown) data.push('----------------------')
    /// interpolate user specified package properties
    data.push(util.replacer(config.data.docs.template[x], {interpolate: true}))
    // add an extra newline between sections
    data.push('\r\n')
  }

  return data
}

export default function release(): void {
  const contents = build()

  // Do some replacign incase they put %%version% in the file path string
  let filename = util.replacer(config.data.docs.dist, {interpolate: true})

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
    filename += 'docs-' + 
      (config.projectPackage.version !== undefined && config.projectPackage.version !== null ? 
        config.projectPackage.version :
        (console.info(colors.yellow('WARNING: No version number found in package file. A timestamp will be used in the documentation filename.')), Date.now().toString())
      )
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