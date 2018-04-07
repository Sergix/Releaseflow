import { exec } from 'child_process'
import * as colors from 'colors'
import { rfconfig } from './config'

export default function release(): void {
  exec(rfconfig.exec, (error, stdout, stderr) => {
      if (error) {
        console.error(colors.red(`ERROR: could not build application executable: ${error}`))
        return
      }

      console.info(colors.green('Finished building application executable.'))
    }
  )
}