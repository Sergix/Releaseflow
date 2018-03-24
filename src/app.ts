#! /usr/bin/env node

import * as program from './program'
import * as config from './config'
import exec from './exec'
import * as changelog from './changelog'
import docs from './docs'
import source from './source'

program.options()
config.load()

if (program.op_changelog) {
    changelog.release()
}

if (program.op_docs) {
    docs()
}

if (program.op_exec) {
    exec()
}

if (program.op_source) {
    source()
}