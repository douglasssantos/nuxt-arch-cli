import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { FileService } from '../../services/FileService.js'
import fs from 'fs-extra'
import path from 'node:path'
import os from 'node:os'

describe('FileService', () => {
  let fileService: FileService
  let tmpDir: string

  beforeEach(async () => {
    fileService = new FileService()
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'file-service-test-'))
  })

  afterEach(async () => {
    await fs.remove(tmpDir)
  })

  it('writes and reads a file', async () => {
    const filePath = path.join(tmpDir, 'test.ts')
    await fileService.write(filePath, 'export const x = 1')
    const content = await fileService.read(filePath)
    expect(content).toBe('export const x = 1')
  })

  it('reports file exists correctly', async () => {
    const filePath = path.join(tmpDir, 'exists.ts')
    expect(await fileService.exists(filePath)).toBe(false)
    await fileService.write(filePath, '')
    expect(await fileService.exists(filePath)).toBe(true)
  })

  it('safeWrite skips existing files without --force', async () => {
    const filePath = path.join(tmpDir, 'safe.ts')
    await fileService.write(filePath, 'original')

    let skipped = false
    const written = await fileService.safeWrite(filePath, 'overwritten', {
      force: false,
      onSkip: () => { skipped = true },
    })

    expect(written).toBe(false)
    expect(skipped).toBe(true)
    const content = await fileService.read(filePath)
    expect(content).toBe('original')
  })

  it('safeWrite overwrites with --force', async () => {
    const filePath = path.join(tmpDir, 'force.ts')
    await fileService.write(filePath, 'original')

    const written = await fileService.safeWrite(filePath, 'overwritten', { force: true })

    expect(written).toBe(true)
    const content = await fileService.read(filePath)
    expect(content).toBe('overwritten')
  })

  it('creates nested directories automatically', async () => {
    const filePath = path.join(tmpDir, 'deep/nested/dir/file.ts')
    await fileService.write(filePath, 'content')
    expect(await fileService.exists(filePath)).toBe(true)
  })
})
