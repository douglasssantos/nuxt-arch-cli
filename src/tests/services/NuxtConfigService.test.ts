import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { NuxtConfigService } from '../../services/NuxtConfigService.js'
import fs from 'fs-extra'
import path from 'node:path'
import os from 'node:os'

describe('NuxtConfigService', () => {
  let service: NuxtConfigService
  let tmpDir: string
  let configPath: string

  beforeEach(async () => {
    service = new NuxtConfigService()
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nuxt-config-test-'))
    configPath = path.join(tmpDir, 'nuxt.config.ts')
  })

  afterEach(async () => {
    await fs.remove(tmpDir)
  })

  it('adds a layer to an empty extends array', async () => {
    await fs.writeFile(
      configPath,
      `export default defineNuxtConfig({ extends: [] })`,
      'utf-8',
    )

    const added = await service.addLayer(configPath, './layers/auth')
    expect(added).toBe(true)

    const content = await fs.readFile(configPath, 'utf-8')
    expect(content).toContain('./layers/auth')
  })

  it('does not add a duplicate layer', async () => {
    await fs.writeFile(
      configPath,
      `export default defineNuxtConfig({ extends: ['./layers/auth'] })`,
      'utf-8',
    )

    const added = await service.addLayer(configPath, './layers/auth')
    expect(added).toBe(false)
  })

  it('keeps layers sorted alphabetically', async () => {
    await fs.writeFile(
      configPath,
      `export default defineNuxtConfig({ extends: ['./layers/tickets'] })`,
      'utf-8',
    )

    await service.addLayer(configPath, './layers/auth')

    const content = await fs.readFile(configPath, 'utf-8')
    const authIdx = content.indexOf('./layers/auth')
    const ticketsIdx = content.indexOf('./layers/tickets')
    expect(authIdx).toBeLessThan(ticketsIdx)
  })

  it('throws if nuxt.config.ts does not exist', async () => {
    await expect(service.addLayer('/non/existent/nuxt.config.ts', './layers/auth')).rejects.toThrow()
  })
})
