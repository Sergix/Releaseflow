import * as program from './program'
import * as config from './config'
import exec from './exec'
import replacer from './replacer'
import changelog from './changelog'
import docs from './docs'

program.options()
config.load()

changelog()
docs()