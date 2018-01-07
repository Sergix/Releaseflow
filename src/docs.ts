import * as program from './program'
import * as changelog from './changelog'
import * as config from './config'
import * as fs from 'fs'

function stringify(data: Array<string>): string {
  let output: string = ''

  for (let i = 0; i < data.length; i++) {
    output += `${data[i]}`
    if (!data[i].endsWith('\n')) {
      output += '\r\n'
    }
  }

  return output
}
function replacer(line: string): string {
  let flag_s: boolean = false, flag_m: boolean = false
  let option: string = ''
  let output: string = ''

  for (let i = 0; i < line.length; i++) {
    if (flag_s || flag_m) {
      if (line[i] !== '%') {
        option += line[i]
        continue
      } else if (line[i] === '%' && !flag_m) {
        flag_s = false
        flag_m = true
        continue
      }

      if (option !== '') {
        if (option === 'changelog') {
          for (let j = 0; j < changelog.current.length; j++) {
            if (config.data.markdown && !changelog.current[j].trim().startsWith('-')) {
              output += '- '
            }
            output += `${changelog.current[j]}\r\n`
          }
        } else {
          output += config.projectPackage[option]
        }

        option = '' // clear option string
      }

      flag_s = false
      flag_m = false
      continue
    }

    if (line[i] === '%') {
      flag_s = true
      continue
    }

    output += line[i]
  }

  return output
}

export function build(): Array<string> {
  const data: Array<string> = []

  data.push('# ' + replacer(config.data.docs.title) + '\r\n\r\n')

  for (const x in config.data.docs.template) {
    data.push(`## ${x}\r\n`) // title
    data.push(replacer(config.data.docs.template[x])) // format the line's specified options
    data.push('\r\n') // extra newline between sections
  }

  return data
}

export default function release(): void {
  const contents = build()
  const filename = config.data.docs.dist + 'docs-' + config.projectPackage.version + '.md'

  fs.writeFile(filename, stringify(contents), (err) => {
    if (!err) {
      console.info(`Finished writing documentation; wrote to ${filename}.`)
    } else {
      console.error(`Failed to create documentation at ${filename}. Perhaps the directory doesn't exist?`)
    }
  })
}