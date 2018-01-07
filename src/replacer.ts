/*
  {
    links: true,
    searchPackage: true
  }
*/
import * as config from './config'

export const regexp_int: string = '((\\d{2,4}(\.(\\d[1-9])|([1-9]\\d))?)|[1-9])'
export const regexp_string: string = '[a-zA-Z0-9]+'

function links(x: string): string {
  let data: string = ''
  const regex = new RegExp(regexp_int) // integer match
  let num: string = ''
  let flag: boolean = false
  let repo: string = config.projectPackage.repository.url

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
        if (config.data.markdown) {
          data += `[#${num}](`
        }
        data += `${repo}/issues/${num}`
        if (config.data.markdown) {
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
    if (config.data.markdown) {
      data += `'[#${num}]('`
    }
    data += repo + '/issues/' + num
    if (config.data.markdown) {
      data += ')'
    }
    num = ''
  }

  return data
}

export default function replacer(x: string, options: {[index: string]: any}): string {
  let output: string = x

  if (options.links) {
    output = links(output)
  }
  if (options.searchPackage) {
    output
  }

  return output
}