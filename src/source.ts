import * as fs from 'fs'
import * as archiver from 'archiver'
import * as config from './config'
import * as colors from 'colors'

export default function release(): void {
  // TODO
  // add verifier for config paths, ensuring they have a '/' character at the end, or '\' if Windows, etc.
  // add custom export filename in config
  // change to array for compression property, allowing multiple formats to be exported

  let filename: string
  let archive: any

  if (config.data.source.compression === 'zip') {
    filename = config.data.source.dist + 'src-' + config.projectPackage.version + '.zip'
    archive = archiver('zip', {
      zlib: { level: 9 }
    })
  } else if (config.data.source.compression === 'tar') {
    filename = config.data.source.dist + 'src-' + config.projectPackage.version + '.tar.gz'
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
}