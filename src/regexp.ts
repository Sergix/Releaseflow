import * as program from './program'
import * as fs from 'fs'
import { rfconfig, projectPackage } from './config'

export const regexp_int: string = '((\\d{2,4}(\.(\\d[1-9])|([1-9]\\d))?)|[1-9])'
export const regexp_string: string = '[a-zA-Z0-9]+'

export function replacer(x: string): string {
  let flag_s: boolean = false, flag_m: boolean = false
  let output: string = ''
  let option: string = ''

  for (let i = 0; i < x.length; i++) {
    if (flag_s || flag_m) {
      if (x[i] !== '%' && flag_m) {
        option += x[i]
        continue
      } else if (x[i] === 'n') {
        output += regexp_int // integer regex
      } else if (x[i] === 's') {
        output += regexp_string // string regex
      } else if (x[i] === 'v') {
        output += '([a-zA-Z0-9]+\\.[a-zA-Z0-9]+\\.[a-zA-Z0-9]+)' // version regex
      } else if (x[i] === '%' && !flag_m) {
        flag_s = false
        flag_m = true
        continue
      }

      if (option !== '') {
        if (projectPackage[option]) {
          for (let j = 0; j < projectPackage[option].length; j++) {
            if (projectPackage[option][j] === '[' || projectPackage[option][j] === ']' || projectPackage[option][j] === '\\' || projectPackage[option][j] === '/' || projectPackage[option][j] === '(' || projectPackage[option][j] === ')' || projectPackage[option][j] === '^' || projectPackage[option][j] === '$' || projectPackage[option][j] === '*' || projectPackage[option][j] === '?' || projectPackage[option][j] === '>' || projectPackage[option][j] === '<' || projectPackage[option][j] === '.' || projectPackage[option][j] === '+' || projectPackage[option][j] === '|' || projectPackage[option][j] === '&' || projectPackage[option][j] === '#' || projectPackage[option][j] === '=' || projectPackage[option][j] === '!' || projectPackage[option][j] === '{' || projectPackage[option][j] === '}' || projectPackage[option][j] === ',') {
              output += '\\'
            }

            output += projectPackage[option][j]
          }
        } else if (rfconfig[option]) {
          for (let j = 0; j < rfconfig[option].length; j++) {
            if (rfconfig[option][j] === '[' || rfconfig[option][j] === ']' || rfconfig[option][j] === '\\' || rfconfig[option][j] === '/' || rfconfig[option][j] === '(' || rfconfig[option][j] === ')' || rfconfig[option][j] === '^' || rfconfig[option][j] === '$' || rfconfig[option][j] === '*' || rfconfig[option][j] === '?' || rfconfig[option][j] === '>' || rfconfig[option][j] === '<' || rfconfig[option][j] === '.' || rfconfig[option][j] === '+' || rfconfig[option][j] === '|' || rfconfig[option][j] === '&' || rfconfig[option][j] === '#' || rfconfig[option][j] === '=' || rfconfig[option][j] === '!' || rfconfig[option][j] === '{' || rfconfig[option][j] === '}' || rfconfig[option][j] === ',') {
              output += '\\'
            }

            output += rfconfig[option][j]
          }
        } else {
          console.warn('Unknown property "' + option + '". Skipping...')
        }

        option = ''
      }

      flag_s = false
      flag_m = false
      continue
    }

    if (x[i] === '%') {
      flag_s = true
      continue
    }

    if (x[i] === '[' || x[i] === ']' || x[i] === '\\' || x[i] === '/' || x[i] === '(' || x[i] === ')' || x[i] === '^' || x[i] === '$' || x[i] === '*' || x[i] === '?' || x[i] === '>' || x[i] === '<' || x[i] === '.' || x[i] === '+' || x[i] === '|' || x[i] === '&' || x[i] === '#' || x[i] === '=' || x[i] === '!' || x[i] === '{' || x[i] === '}' || x[i] === ',') {
      output += '\\'
    }

    output += x[i]
  }

  return output
}