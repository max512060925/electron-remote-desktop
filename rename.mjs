import { rename, readdir } from 'node:fs/promises'
import { join, resolve } from 'path'

const dist = resolve('./dist')

const jsFiles = (await readdir(dist)).filter(n => /\.js$/.test(n))

await Promise.all(
  jsFiles.map(n =>
    rename(join(dist, n), join(dist, n.replace(/\.js$/, '.cjs')))
  )
)
