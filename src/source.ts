import * as fs from 'fs'
import * as archiver from 'archiver'
import { filenameHandler, replacer } from './util'
import * as colors from 'colors'
import { rfconfig, projectPackage } from './config'

export default function release(): void {
  // TODO
  // add verifier for config paths, ensuring they have a '/' character at the end, or '\' if Windows, etc.
  let archive: any
  let filename: string

  rfconfig.source.compression.forEach((type: string) => {

    if (type === 'zip') {
      filename = replacer(rfconfig.source.dist, {interpolate: true, ext: 'zip'})
      filename = filenameHandler(filename, 'zip', 'src', 'source package')

      archive = archiver('zip', {
        zlib: { level: 9 }
      })
    } else if (type === 'tar') {
      filename = replacer(rfconfig.source.dist, {interpolate: true, ext: 'tar.gz'})
      filename = filenameHandler(filename, 'tar.gz', 'src', 'source package')

      archive = archiver('tar', {
        gzip: true,
        gzipOptions: { level: 9 }
      })
    }

    const output = fs.createWriteStream(filename)

    output.on('close', function() {
      console.info(colors.green('Finished packaging source to '), colors.bgGreen.white(`${filename}`))
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

    archive.on('error', function(err: any) {
      throw err
    })

    archive.pipe(output)

    rfconfig.source.dir.forEach((dir: string) => {
      dir.trim()
      archive.glob(dir)
    })

    archive.finalize()
  })
}