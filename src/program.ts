import * as program from 'commander'
import * as jsonfile from 'jsonfile'

export let op_changelog: boolean
export let op_docs: boolean
export let op_exec: boolean
export let op_source: boolean
export let op_configFile: string

export function options(): void {
  program
    .version(jsonfile.readFileSync('package.json').version)
    .option('-l, --changelog', 'build changelog')
    .option('-d, --docs', 'build documentation template')
    .option('-e, --exec', 'build executable')
    .option('-c, --config <path>', 'set config path')
    .option('-s, --source', 'package source code')
    .parse(process.argv)

  op_changelog  = program.changelog ? true 		       : false
  op_docs	      = program.docs 	    ? true 		       : false
  op_exec	      = program.exec 	    ? true 		       : false
  op_source     = program.source    ? true           : false
  op_configFile = program.config    ? program.config : undefined
}