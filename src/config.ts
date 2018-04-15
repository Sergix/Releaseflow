import * as program from './program'
import * as json from 'jsonfile'
import * as fs from 'fs'
import * as colors from 'colors'
import * as xmlj from 'xml2js'
import { nl } from './util'

const template = {
  'package': './package.json',
  'markdown': true,
  'docs': {
    'title': 'Project Template %%version% Documentation',
    'dist': './docs/',
    'template': {
      'Overview': 'This is the documentation for %%name%.',
      'Table of Contents': '%%toc%',
      'Changelog': '%%changelog%',
      'Licensing': '%%name% version %%version% licensed under %%license%'
    }
  },
  'changelog': {
    'path': 'changelog.txt',
    'header_format': '(%n)[%n/%n/%n-%n:%n %%version% %s]',
    'replace_links': true,
    'dist': './changelog/',
    'ignore': ['Signed off by user.']
  },
  'source': {
    'dir': ['src/exampleFile.txt', 'src/exampleDirectory/exampleSubDirectory/', 'src/example5/*'],
    'dist': './source/',
    'compression': ['zip', 'tar']
  },
  'exec': 'npm run build'
}

export let path: string = 'rfconfig.json'
export let rfconfig: { [index: string]: any } = template
export let projectPackage: { [index: string]: any }
export let projectType: string = ''

export function load(): void {
  let packageFile: string

  if (program.op_configFile !== undefined) { // config file path was specified by user
    path = program.op_configFile
  }

  rfconfig = json.readFileSync(path, {throws: false})

  if (rfconfig === null) { // config file does not exist
    console.info(colors.cyan('Creating template config file in current directory...'))

    json.writeFileSync('rfconfig.json', template, {spaces: 2, EOL: nl})

    console.info(colors.yellow.underline(path), colors.yellow('file created. Please modify this file to your liking, then run the application again.\n\nReleaseflow will now close.'))
    process.exit(0)

    return
  }

  try {
    packageFile = fs.readFileSync(rfconfig.package).toString()
  } catch (err) {
    console.info(colors.cyan(err))
    console.error(colors.red(`ERROR: Could not read project file "${rfconfig.package}".`))
    process.exit(0)
  }

  if (rfconfig.package.endsWith('.json')) {
    if (rfconfig.package.endsWith('package.json')) projectType = 'node' // Node.js

    projectPackage = JSON.parse(packageFile)
  } else if (rfconfig.package.endsWith('.xml')) {
    if (rfconfig.package.endsWith('pom.xml')) projectType = 'mvn' // Maven

    xmlj.parseString(packageFile, (err, result) => {
      if (err) {
        console.error(colors.red('ERROR: Failed to parse package XML data.'))
        process.exit(0)
      }
      projectPackage = result.project
    })
  }
}