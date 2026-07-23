import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const cliPath = join(__dirname, '..', 'dist', 'cli.js')

const content = readFileSync(cliPath, 'utf-8')
const shebang = '#!/usr/bin/env node\n'

if (!content.startsWith('#!')) {
  writeFileSync(cliPath, shebang + content, 'utf-8')
  console.log('✔ Shebang added to dist/cli.js')
} else {
  console.log('✔ Shebang already present in dist/cli.js')
}
