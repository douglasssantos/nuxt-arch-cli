import path from 'node:path'
import { defaultConfig } from '../config/index.js'

export class PathResolver {
  private readonly cwd: string
  private readonly layersDir: string

  constructor(cwd: string = process.cwd(), layersDir: string = defaultConfig.layersDir) {
    this.cwd = cwd
    this.layersDir = layersDir
  }

  layerRoot(layer: string): string {
    return path.join(this.cwd, this.layersDir, layer)
  }

  layerPath(layer: string, ...segments: string[]): string {
    return path.join(this.layerRoot(layer), ...segments)
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
