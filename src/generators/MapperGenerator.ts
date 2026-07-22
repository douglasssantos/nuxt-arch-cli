import { BaseGenerator, type GeneratorOptions } from './BaseGenerator.js'

export class MapperGenerator extends BaseGenerator {
  async generate(options: GeneratorOptions): Promise<void> {
    const names = this.resolveNames(options.name)
    const filePath = this.pathResolver.layerPath(
      options.layer,
      'infrastructure/mappers',
      `${names.pascal}Mapper.ts`,
    )
    const barrelPath = this.pathResolver.layerPath(
      options.layer,
      'infrastructure/mappers',
      'index.ts',
    )

    await this.generateFile(filePath, 'mapper', { ...names, layer: options.layer }, options)

    await this.barrelService.addExport(barrelPath, `${names.pascal}Mapper`)
    this.logger.updated(barrelPath)
  }
}
