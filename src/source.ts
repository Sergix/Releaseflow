import * as fs from 'fs'
import * as archiver from 'archiver'
import * as config from './config'

export function release(): void {
  // TODO
  //
  // add verifier for config paths, ensuring they have a '/' character at the end, or '\' if Windows, etc.
  //
  const output = fs.createWriteStream(config.data.source.dist + 'test.zip')
  const archive = archiver('zip', {
    zlib: { level: 9 }
  })

  output.on('close', function() {
    console.info('Finished packaging source.')
  })

  output.on('end', function() {
    console.warn('Issue with data.')
  })

  archive.on('warning', (err: any) => {
    if (err.code === 'ENOENT') {
      console.warn(err)
    } else {
      throw err
    }
  })

  archive.on('error', function(err) {
    throw err
  })

  archive.pipe(output)

  const sources: Array<string> = config.data.source.dir.split(';')

  sources.forEach(dir => {
    dir.trim()
    archive.glob(dir)
  })

  archive.finalize()
}