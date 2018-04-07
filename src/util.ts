import * as changelog from './changelog'
import { projectPackage, rfconfig, projectType } from './config'
import * as docs from './docs'
import * as colors from 'colors'
import { statSync } from 'fs'

export const regexp_int: string = '((\\d{2,4}(\.(\\d[1-9])|([1-9]\\d))?)|[1-9])'
export const regexp_string: string = '[a-zA-Z0-9]+'
export const nl: string = '\r\n'

export function stringify(data: Array<string>): string {
    let output: string = ''

    for (let i = 0; i < data.length; i++) {
        output += data[i]
        if (!data[i].endsWith('\n')) {
          output += nl
        }
    }

    return output
}

function links(x: string): string {
  let data: string = ''
  const regex = new RegExp(regexp_int) // integer match
  let num: string = ''
  let flag: boolean = false
  let repo: string =
    projectType === 'node' ? projectPackage.repository.url
      : (projectType === 'mvn' ? projectPackage.url.toString()
      : (console.error(colors.red('ERROR: Could not replace links, no URL property found in project package file.')),
          process.exit(0)
      )
    )

  if (repo.endsWith('.git')) {
    repo = repo.substr(0, repo.length - 4)
  } else if (repo.endsWith('/')) {
    repo = repo.substr(0, repo.length - 1)
  }

  for (let i = 0; i < x.length; i++) { // character
    if (flag) { // flag is set
      if (/[0-9]/.test(x[i])) { // is an integer
        num += x[i] // add it to the issue number string
        continue
      } else if (num !== '') { // if we have finished reading a number
        if (rfconfig.markdown) {
          data += `[#${num}](`
        }
        data += `${repo}/issues/${num}`
        if (rfconfig.markdown) {
          data += ')'
        }
        num = ''
      }
      // not a number and we are not currently reading a number
      flag = false
    }

    if (x[i] === '#') { // if the character is a '#'
      flag = true
      continue
    }

    data += x[i] // add the character to the line
  }

  if (num !== '') {
    if (rfconfig.markdown) {
      data += `'[#${num}]('`
    }
    data += repo + '/issues/' + num
    if (rfconfig.markdown) {
      data += ')'
    }
    num = ''
  }

  return data
}

function interpolater(line: string, ext?: string): string {
  /*
  flag_s: single '%'
  flag_m: double '%'
  */
  let flag_s: boolean = false, flag_m: boolean = false
  let option: string = ''
  let output: string = ''

  // Loop through the line string
  for (let i = 0; i < line.length; i++) {
    // If one of the flags is set
    if (flag_s || flag_m) {
      // and it's an 'e'
      if (line[i] === 'e' && flag_s) {
        // add file extension parameter
        output += ext !== undefined ? ext : (rfconfig.markdown ? 'md' : 'txt')
        // clear flags and move to next char
        flag_s = false
        flag_m = false
        continue
      } else if (line[i] !== '%' && flag_m) {
        // go ahead and add the character to the option string
        option += line[i]
        continue
      // and the current character is a '%' ('%%') and the flag is not already set
      } else if (line[i] === '%' && !flag_m) {
        // set the flags correspondingly, for we are now reading an interpolater
        flag_s = false
        flag_m = true
        continue
      // and the current character is 'e' and the flag is not already set
      }

      // if the option is not null
      if (option !== '') {
        // and the option is changelog
        if (option === 'changelog') {
          // if we have not yet built the changelog
          if (changelog.current.length === 0) {
            // then go ahead and do that, without writing to the changelog's output file
            changelog.release(false)
          }
          // loop through the changelog array
          for (let j = 0; j < changelog.current.length; j++) {
            // and append each line to the output
            output += `${changelog.current[j]}` + nl
          }
        // and the option is toc
        } else if (option === 'toc') {
          // add the table of contents
          output += `${docs.toc}`
        // and it's a package variable
        } else {
          // if the package is loaded and good to go
          if (projectPackage !== undefined)
            // then get the property from the package file
            output += projectPackage[option]
        }

        // clear option string
        option = ''
      }

      // we finished reading an interpolater, so reset the flags
      flag_s = false
      flag_m = false
      continue
    }

    // if the character is a '%'
    if (line[i] === '%') {
      // then hint for the next iteration that we might be reading an interpolater string
      flag_s = true
      continue
    }

    // nothing happened, just add the character
    output += line[i]
  }

  return output
}

/*
  {
    links: true,
    interpolate: true,
    ext: 'md'
  }
*/
export function replacer(x: string, options: {[index: string]: any}): string {
  let output: string = x

  if (options.links) {
    output = links(output)
  }

  if (options.interpolate) {
    output = interpolater(output, options.ext !== undefined ? options.ext : undefined)
  }

  return output
}

export function filenameHandler(filename: string, ext: string, prefix: string, logMsg: string): string {
  let isDir: boolean = false
  const path: string = filename.slice(0, filename.lastIndexOf('/'))

  console.info(colors.cyan(path))

  // check if the directory exists
  try {
    if (statSync(filename).isDirectory()) {
      isDir = true
    }
  } catch (err) {
    try {
      if (statSync(path).isDirectory()) {
        return filename
      }
    } catch (err) {
      // check if its a file
      try {
        if (statSync(filename).isFile()) {
          isDir = false
        }
      } catch (err) {
        console.error(colors.red(err))
        console.error(colors.red(`ERROR: Could not find directory or file ${filename}.`))
        process.exit(0)
      }
    }
  }

  if (isDir) {
    if (!filename.endsWith('/') && !filename.endsWith('\\')) filename += '/'
    filename += prefix + '-'
    try {
      filename += projectPackage.version
    } catch (err) {
      colors.yellow(`WARNING: No version number found in package file. A timestamp will be used in the ${logMsg} filename.`)
      filename += Date.now().toString()
    }
    filename += '.' + ext
  }

  return filename
}