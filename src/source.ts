import * as fs from 'fs'
import * as archiver from 'archiver'
import * as config from './config'
import * as util from './util'
import * as colors from 'colors'

export default function release(): void {
  // TODO
  // add verifier for config paths, ensuring they have a '/' character at the end, or '\' if Windows, etc.
  // add custom export filename in config
  // change to array for compression property, allowing multiple formats to be exported
  let archive: any
  let filename = util.replacer(config.data.source.dist, {interpolate: true})

  // If the path is a directory, check if it ends with a '/' and append a default string along with
  // the version number if available; otherwise, slap a timestamp on the filename as the fallback to make sure
  // we don't overwrite any existing files, as well as provide a warning.
  if (fs.statSync(filename).isDirectory()) {
    if (!filename.endsWith('/') && !filename.endsWith('\\')) {
      filename += '/'
    }
    filename += 'src-' + 
      (config.projectPackage.version !== undefined && config.projectPackage.version !== null ? 
        config.projectPackage.version :
        (console.info(colors.yellow('WARNING: No version number found in package file. A timestamp will be used in the source package filename.')), Date.now().toString())
      )
  }

  config.data.source.compression.forEach((type: string) => {

    if (type === 'zip') {
      // Replace the interpolater indentifier '%e' with the file extension
      filename.replace(/%e/, 'zip')
      archive = archiver('zip', {
        zlib: { level: 9 }
      })
    } else if (type === 'tar') {
      // Replace the interpolater indentifier '%e' with the file extension
      filename.replace(/%e/, 'tar.gz')
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

    config.data.source.dir.forEach((dir: string) => {
      dir.trim()
      archive.glob(dir)
    })

    archive.finalize()
  })
}