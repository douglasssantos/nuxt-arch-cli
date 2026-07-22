import path from 'node:path'
import { FileService } from '../services/FileService.js'
import { TemplateService } from '../services/TemplateService.js'
import { FormatterService } from '../services/FormatterService.js'
import { NuxtConfigService } from '../services/NuxtConfigService.js'
import { LoggerService } from '../services/LoggerService.js'
import { NameResolver } from '../utils/NameResolver.js'
import { PathResolver } from '../utils/PathResolver.js'
import { FileWriter } from '../utils/FileWriter.js'
import { LAYER_DIRS } from '../config/index.js'

export interface LayerGeneratorOptions {
  force?: boolean
  cwd?: string
}

export class LayerGenerator {
  constructor(
    private readonly fileService: FileService,
    private readonly templateService: TemplateService,
    private readonly formatterService: FormatterService,
    private readonly nuxtConfigService: NuxtConfigService,
    private readonly logger: LoggerService,
    private readonly pathResolver: PathResolver,
  ) {}

  async generate(layerName: string, options: LayerGeneratorOptions = {}): Promise<void> {
    const name = NameResolver.resolve(layerName)
    const layerRoot = this.pathResolver.layerRoot(name.kebab)
    const cwd = options.cwd ?? process.cwd()

    this.logger.title(`Creating layer: ${name.kebab}`)

    // Create all directories
    const dirs = this.buildDirList(layerRoot)
    await FileWriter.ensureDirs(dirs)

    // Generate nuxt.config.ts for the layer
    await this.generateLayerConfig(layerRoot, name.pascal, options.force)

    // Generate index.ts for the layer
    await this.generateLayerIndex(layerRoot, name.pascal, options.force)

    // Update root nuxt.config.ts
    await this.updateRootConfig(cwd, name.kebab)

    this.logger.newLine()
    this.logger.success(`Layer "${name.kebab}" created successfully.`)
  }

  private buildDirList(layerRoot: string): string[] {
    return [
      path.join(layerRoot, LAYER_DIRS.app.components),
      path.join(layerRoot, LAYER_DIRS.app.composables),
      path.join(layerRoot, LAYER_DIRS.app.middleware),
      path.join(layerRoot, LAYER_DIRS.app.pages),
      path.join(layerRoot, LAYER_DIRS.app.plugins),
      path.join(layerRoot, LAYER_DIRS.application.dto),
      path.join(layerRoot, LAYER_DIRS.application.commands),
      path.join(layerRoot, LAYER_DIRS.application.queries),
      path.join(layerRoot, LAYER_DIRS.application.usecases),
      path.join(layerRoot, LAYER_DIRS.domain.entities),
      path.join(layerRoot, LAYER_DIRS.domain.repositories),
      path.join(layerRoot, LAYER_DIRS.domain.services),
      path.join(layerRoot, LAYER_DIRS.domain.contracts),
      path.join(layerRoot, LAYER_DIRS.domain.valueObjects),
      path.join(layerRoot, LAYER_DIRS.infrastructure.api),
      path.join(layerRoot, LAYER_DIRS.infrastructure.mappers),
      path.join(layerRoot, LAYER_DIRS.infrastructure.repositories),
      path.join(layerRoot, LAYER_DIRS.infrastructure.stores),
      path.join(layerRoot, LAYER_DIRS.tests),
    ]
  }

  private async generateLayerConfig(
    layerRoot: string,
    pascalName: string,
    force?: boolean,
  ): Promise<void> {
    const filePath = path.join(layerRoot, 'nuxt.config.ts')
    const resolved = NameResolver.resolve(pascalName)
    const content = await this.templateService.render('layer/nuxt.config', {
      pascalName: resolved.pascal,
      camelName: resolved.camel,
      kebabName: resolved.kebab,
      snakeName: resolved.snake,
      upperName: resolved.upper,
    })
    const formatted = await this.formatterService.formatTypeScript(content)
    await this.fileService.safeWrite(filePath, formatted, {
      force,
      onWrite: () => this.logger.created(filePath),
      onSkip: () => this.logger.skipped(filePath, 'already exists'),
    })
  }

  private async generateLayerIndex(
    layerRoot: string,
    pascalName: string,
    force?: boolean,
  ): Promise<void> {
    const filePath = path.join(layerRoot, 'index.ts')
    const resolved = NameResolver.resolve(pascalName)
    const content = await this.templateService.render('layer/index', {
      pascalName: resolved.pascal,
      camelName: resolved.camel,
      kebabName: resolved.kebab,
      snakeName: resolved.snake,
      upperName: resolved.upper,
    })
    await this.fileService.safeWrite(filePath, content, {
      force,
      onWrite: () => this.logger.created(filePath),
      onSkip: () => this.logger.skipped(filePath, 'already exists'),
    })
  }

  private async updateRootConfig(_cwd: string, layerName: string): Promise<void> {
    const nuxtConfigPath = this.pathResolver.nuxtConfig()
    const layerPath = `./layers/${layerName}`

    try {
      const added = await this.nuxtConfigService.addLayer(nuxtConfigPath, layerPath)
      if (added) {
        this.logger.updated(nuxtConfigPath)
      } else {
        this.logger.skipped(nuxtConfigPath, 'layer already registered')
      }
    } catch (error) {
      this.logger.warn(
        `Could not update nuxt.config.ts automatically: ${(error as Error).message}`,
      )
    }
  }
}
