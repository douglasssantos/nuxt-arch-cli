import { FileReader } from '../utils/FileReader.js'
import { defaultConfig, type CliConfig } from '../config/index.js'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'

// Resolve tsx from the CLI's own node_modules
const _require = createRequire(import.meta.url)
function findTsx(): string | null {
  try {
    return _require.resolve('tsx/esm')
  } catch {
    return null
  }
}

export class ConfigService {
  private config: CliConfig = { ...defaultConfig, events: { ...defaultConfig.events } }
  private loaded = false

  async load(cwd: string = process.cwd()): Promise<CliConfig> {
    if (this.loaded) return this.config

    // Priority: .json (native) → .js (ESM import) → .ts (via tsx from CLI)
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
          if (mod.default) {
            this.config = this.merge(mod.default)
            break
          }
        }

        if (candidate.type === 'ts') {
          const tsxEsm = findTsx()
          if (!tsxEsm) continue

          // Run tsx from CLI's own node_modules to evaluate the .ts config
          const json = execSync(
            `node --import "${tsxEsm}" -e "import cfg from '${candidate.filePath.replace(/\\/g, '/')}'; process.stdout.write(JSON.stringify(cfg.default ?? cfg))"`,
            { encoding: 'utf-8', timeout: 5000 },
          )
          const userConfig = JSON.parse(json) as Partial<CliConfig>
          this.config = this.merge(userConfig)
          break
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
