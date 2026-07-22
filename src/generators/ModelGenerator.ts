import { BaseGenerator, type GeneratorOptions } from './BaseGenerator.js'

export class ModelGenerator extends BaseGenerator {
  async generate(options: GeneratorOptions): Promise<void> {
    const names = this.resolveNames(options.name)
    const filePath = this.pathResolver.layerPath(
      options.layer,
      'domain/entities',
      `${names.pascal}.ts`,
    )
    const barrelPath = this.pathResolver.layerPath(options.layer, 'domain/entities', 'index.ts')

    await this.generateFile(filePath, 'model', { ...names, layer: options.layer }, options)

    await this.barrelService.addExport(barrelPath, names.pascal)
    this.logger.updated(barrelPath)
  }
}
