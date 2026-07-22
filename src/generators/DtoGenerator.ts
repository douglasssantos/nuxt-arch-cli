import { BaseGenerator, type GeneratorOptions } from './BaseGenerator.js'

export class DtoGenerator extends BaseGenerator {
  async generate(options: GeneratorOptions): Promise<void> {
    const names = this.resolveNames(options.name)
    const filePath = this.pathResolver.layerPath(
      options.layer,
      'application/dto',
      `${names.pascal}Dto.ts`,
    )
    const barrelPath = this.pathResolver.layerPath(options.layer, 'application/dto', 'index.ts')

    await this.generateFile(filePath, 'dto', { ...names, layer: options.layer }, options)

    await this.barrelService.addExport(barrelPath, `${names.pascal}Dto`)
    this.logger.updated(barrelPath)
  }
}
