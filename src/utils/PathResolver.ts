import path from 'node:path'
import { defaultConfig } from '../config/index.js'

export class PathResolver {
  private readonly cwd: string
  private layersDir: string
  private modulesDir: string
  private nuxtVersion: 'v3' | 'v4' = 'v4'

  constructor(cwd: string = process.cwd(), layersDir: string = defaultConfig.layersDir, modulesDir: string = defaultConfig.modulesDir) {
    this.cwd = cwd
    this.layersDir = layersDir
    this.modulesDir = modulesDir
  }

  setNuxtVersion(version: 'v3' | 'v4'): void {
    this.nuxtVersion = version
  }

  setLayersDir(dir: string): void {
    this.layersDir = dir
  }

  setModulesDir(dir: string): void {
    this.modulesDir = dir
  }

  /**
   * Returns the given subdirectory prefixed with 'app/' for Nuxt v4,
   * or without the prefix for Nuxt v3.
   * e.g. appDir('pages') → 'app/pages' (v4) | 'pages' (v3)
   */
  appDir(subDir: string): string {
    return this.nuxtVersion === 'v4' ? `app/${subDir}` : subDir
  }

  /**
   * Resolves a configured layer app-path respecting the Nuxt version.
   * If the path starts with 'app/', strips the prefix on v3.
   * Custom paths (not starting with 'app/') are returned as-is.
   */
  resolveAppPath(configuredPath: string): string {
    if (configuredPath.startsWith('app/')) {
      return this.appDir(configuredPath.slice(4))
    }
    return configuredPath
  }

  layerRoot(layer: string): string {
    return path.join(this.cwd, this.layersDir, layer)
  }

  layerPath(layer: string, ...segments: string[]): string {
    return path.join(this.layerRoot(layer), ...segments)
  }

  moduleRoot(module: string): string {
    return path.join(this.cwd, this.modulesDir, module)
  }

  modulePath(module: string, ...segments: string[]): string {
    return path.join(this.moduleRoot(module), ...segments)
  }

  get layers(): string {
    return this.layersDir
  }

  get modules(): string {
    return this.modulesDir
  }

  get version(): 'v3' | 'v4' {
    return this.nuxtVersion
  }

  nuxtConfig(): string {
    return path.join(this.cwd, defaultConfig.nuxtConfigFile)
  }

  barrelFile(...segments: string[]): string {
    return path.join(this.cwd, ...segments, 'index.ts')
  }

  relative(from: string, to: string): string {
    return path.relative(from, to)
  }

  resolve(...segments: string[]): string {
    return path.join(this.cwd, ...segments)
  }
}
