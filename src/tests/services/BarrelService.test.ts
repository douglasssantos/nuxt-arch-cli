import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { BarrelService } from '../../services/BarrelService.js'
import fs from 'fs-extra'
import path from 'node:path'
import os from 'node:os'

describe('BarrelService', () => {
  let barrelService: BarrelService
  let tmpDir: string
  let barrelPath: string

  beforeEach(async () => {
    barrelService = new BarrelService()
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'barrel-test-'))
    barrelPath = path.join(tmpDir, 'index.ts')
  })

  afterEach(async () => {
    await fs.remove(tmpDir)
  })

  it('creates a barrel file if it does not exist', async () => {
    await barrelService.addExport(barrelPath, 'User')

    const content = await fs.readFile(barrelPath, 'utf-8')
    expect(content).toContain("export * from './User'")
  })

  it('adds an export to an existing barrel file', async () => {
    await fs.writeFile(barrelPath, "export * from './User'\n")
    await barrelService.addExport(barrelPath, 'Role')

    const content = await fs.readFile(barrelPath, 'utf-8')
    expect(content).toContain("export * from './User'")
    expect(content).toContain("export * from './Role'")
  })

  it('does not duplicate an existing export', async () => {
    await fs.writeFile(barrelPath, "export * from './User'\n")
    const added = await barrelService.addExport(barrelPath, 'User')

    expect(added).toBe(false)
    const content = await fs.readFile(barrelPath, 'utf-8')
    const count = (content.match(/export \* from '\.\/User'/g) ?? []).length
    expect(count).toBe(1)
  })

  it('keeps exports sorted alphabetically', async () => {
    await barrelService.addExport(barrelPath, 'Role')
    await barrelService.addExport(barrelPath, 'User')
    await barrelService.addExport(barrelPath, 'Admin')

    const content = await fs.readFile(barrelPath, 'utf-8')
    const lines = content.split('\n').filter(Boolean)
    const sorted = [...lines].sort()
    expect(lines).toEqual(sorted)
  })
})
