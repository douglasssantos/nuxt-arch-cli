import { FileReader } from '../utils/FileReader.js'
import { defaultConfig, type CliConfig } from '../config/index.js'
import path from 'node:path'

export class ConfigService {
  private config: CliConfig = { ...defaultConfig }
  private loaded = false

  async load(cwd: string = process.cwd()): Promise<CliConfig> {
    if (this.loaded) return this.config

    const configPath = path.join(cwd, 'nuxt-architect.config.ts')
    const exists = await FileReader.exists(configPath)

    if (exists) {
      try {
        // Dynamic import for user config (ESM)
        const userConfig = (await import(configPath)) as { default?: Partial<CliConfig> }
        if (userConfig.default) {
          this.config = { ...defaultConfig, ...userConfig.default }
        }
      } catch {
        // Use defaults silently if config cannot be loaded
      }
    }

    this.loaded = true
    return this.config
  }

  get(): CliConfig {
    return this.config
  }
}
