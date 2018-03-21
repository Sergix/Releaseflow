import * as program from './program'
import * as json from 'jsonfile'
import * as fs from 'fs'
import * as colors from 'colors'
import * as xmlj from 'xml2js'

const template = json.readFileSync('./src/template.json')

export let path: string = 'rfconfig.json'
export let data: { [index: string]: any } = template
export let projectPackage: { [index: string]: any }
export let type: string = ''

export function load(): void {
  if (program.op_configFile !== undefined) { // config file path was specified by user
    path = program.op_configFile
  }

  const file: object = json.readFileSync(path, {throws: false})

  if (file === null) { // config file does not exist
    console.info(colors.cyan('Creating template config file in current directory...'))

    json.writeFileSync(path, template, {spaces: 2, EOL: '\r\n'})

    console.info(colors.yellow.underline('rfconfig.json'), colors.yellow('file created. Please modify this file to your liking, then run the application again.\n\nReleaseflow will now close.'))
    console.info(process.exit(0))

    return
  }

  data = json.readFileSync(path)

  // TODO
  // assuming the package data is in json... at the moment
  // add statement to check file extension and parse xml as well

  if (data.package) {
    if (data.package.endsWith('package.json')) { // Node.js
      type = 'node'
      projectPackage = JSON.parse(fs.readFileSync(data.package).toString())
    } else if (data.package.endsWith('pom.xml')) { // Maven
      xmlj.parseString(fs.readFileSync(data.package).toString(), (err, result) => {
        if (err) {
          console.error(colors.red('ERROR: Failed to parse pom.xml XML data'))
          return
        }
        type = 'mvn'
        projectPackage = result.project
      })
    }
  }
}