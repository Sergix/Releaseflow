import * as config from './config'
import * as shell from 'child_process'

export default function release(): void {
  shell.exec(config.projectPackage.scripts.build, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error building application executable: ${error}`)
        return
      }
    }
  )
}