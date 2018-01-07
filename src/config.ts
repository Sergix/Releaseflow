import * as program from './program'
import * as json from 'jsonfile'
import * as fs from 'fs'

const template = {
  package: './package.json',
  markdown: true,
  docs: {
    title: 'Project Template %version% Documentation',
    dist: './docs/',
    template: {
      'Overview': 'This is the documentation for %name%.',
      'Table of Contents': '%toc%',
      'Changelog': '%changelog%',
      'Licensing': '%name% version %version% licensed under %license%',
    }
  },
  changelog: {
    path: 'changelog.txt',
    header_format: '(%n)[%n/%n/%n-%n:%n %version% %s]',
    replace_links: true, // replaces "#34" with "[#34](%repository%/issues/34)"
  },
  source: {
    dir: 'src/exampleFile.txt; src/exampleDirectory/exampleSubDirectory/; src/example5/*',
  },
}

export let path: string = 'rfconfig.json'
export let data: { [index: string]: any } = template
export let projectPackage: { [index: string]: any }

export function load(): void {
  if (program.op_configFile !== undefined) { // config file path was specified by user
    path = program.op_configFile
  }

  const file: object = json.readFileSync(path, {throws: false})

  if (file === null) { // config file does not exist
    console.info('Creating template config file in current directory...')
    json.writeFile(path, template, {spaces: 2, EOL: '\r\n'}, (err) => {
      if (err !== null) console.error(err)
    })
    return
  }

  data = json.readFileSync(path)

  // TODO
  // assuming the package data is in json... at the moment
  // add statement to check file extension and parse xml as well
  //
  // also assuming it exists
  if (data.package) {
    projectPackage = JSON.parse(fs.readFileSync(data.package).toString())
  }
}