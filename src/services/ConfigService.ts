import { FileReader } from '../utils/FileReader.js'
import { defaultConfig, type CliConfig } from '../config/index.js'
import path from 'node:path'
import { writeFileSync, unlinkSync, existsSync } from 'node:fs'

export class ConfigService {
  private config: CliConfig = { ...defaultConfig, events: { ...defaultConfig.events } }
  private loaded = false

  async load(cwd: string = process.cwd()): Promise<CliConfig> {
    if (this.loaded) return this.config

    // Priority: .json (native) → .js/.ts (ESM import via .mjs temp)
    const candidates = [
      { filePath: path.join(cwd, 'nuxt-cli.config.json'), type: 'json' as const },
      { filePath: path.join(cwd, 'nuxt-architect.config.json'), type: 'json' as const },
      { filePath: path.join(cwd, 'nuxt-cli.config.js'), type: 'esm' as const },
      { filePath: path.join(cwd, 'nuxt-architect.config.js'), type: 'esm' as const },
      { filePath: path.join(cwd, 'nuxt-cli.config.ts'), type: 'ts' as const },
      { filePath: path.join(cwd, 'nuxt-architect.config.ts'), type: 'ts' as const },
    ]

    for (const candidate of candidates) {
      if (!(await FileReader.exists(candidate.filePath))) continue

      try {
        if (candidate.type === 'json') {
          const raw = await FileReader.read(candidate.filePath)
          this.config = this.merge(JSON.parse(raw) as Partial<CliConfig>)
          break
        }

        if (candidate.type === 'esm') {
          const mod = (await import(`${candidate.filePath}?t=${Date.now()}`)) as {
            default?: Partial<CliConfig>
          }
          if (mod.default) { this.config = this.merge(mod.default); break }
        }

        if (candidate.type === 'ts') {
          // Strategy: copy .ts → temp .mjs (configs are plain JS with .ts extension)
          // then import and clean up
          const tempPath = candidate.filePath.replace(/\.ts$/, `._tmp_${Date.now()}.mjs`)
          try {
            const source = await FileReader.read(candidate.filePath)
            writeFileSync(tempPath, source, 'utf-8')
            const mod = (await import(`${tempPath}?t=${Date.now()}`)) as {
              default?: Partial<CliConfig>
            }
            if (mod.default) { this.config = this.merge(mod.default); break }
          } finally {
            if (existsSync(tempPath)) unlinkSync(tempPath)
          }
        }
      } catch {
        // Try next candidate silently
      }
    }

    this.loaded = true
    return this.config
  }

  private merge(userConfig: Partial<CliConfig>): CliConfig {
    return {
      ...defaultConfig,
      ...userConfig,
      layerDirs: {
        ...defaultConfig.layerDirs,
        ...(userConfig.layerDirs ?? {}),
        app: { ...defaultConfig.layerDirs.app, ...(userConfig.layerDirs?.app ?? {}) },
        application: { ...defaultConfig.layerDirs.application, ...(userConfig.layerDirs?.application ?? {}) },
        domain: { ...defaultConfig.layerDirs.domain, ...(userConfig.layerDirs?.domain ?? {}) },
        infrastructure: { ...defaultConfig.layerDirs.infrastructure, ...(userConfig.layerDirs?.infrastructure ?? {}) },
      },
      moduleDirs: { ...defaultConfig.moduleDirs, ...(userConfig.moduleDirs ?? {}) },
      events: { ...defaultConfig.events, ...(userConfig.events ?? {}) },
    }
  }

  get(): CliConfig {
    return this.config
  }

  /**
   * Resolves the target kind for commands that support layer/module targeting.
   * Priority: explicit flag → config.architecture → undefined (auto-detect from filesystem)
   */
  resolveTargetKind(
    explicitKind: 'layer' | 'module' | undefined,
  ): 'layer' | 'module' | undefined {
    if (explicitKind) return explicitKind
    if (this.config.architecture === 'auto') return undefined
    return this.config.architecture
  }
}
