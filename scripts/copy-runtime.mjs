import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = join(__dirname, '..', 'src', 'runtime')
const dest = join(__dirname, '..', 'dist', 'runtime')

if (!existsSync(dest)) {
  mkdirSync(dest, { recursive: true })
}

cpSync(src, dest, { recursive: true, force: true })
console.log('✔ Runtime files copied to dist/runtime')
