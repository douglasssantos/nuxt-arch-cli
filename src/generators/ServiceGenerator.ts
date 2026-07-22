import { BaseGenerator, type GeneratorOptions } from './BaseGenerator.js'

export class ServiceGenerator extends BaseGenerator {
  async generate(options: GeneratorOptions): Promise<void> {
    const names = this.resolveNames(options.name)
    const layerNames = this.resolveNames(options.layer)
    const fileName = `${layerNames.pascal}Api.ts`
    const filePath = this.pathResolver.layerPath(options.layer, 'infrastructure/api', fileName)
    const barrelPath = this.pathResolver.layerPath(options.layer, 'infrastructure/api', 'index.ts')

    await this.generateFile(filePath, 'service', { ...names, layer: options.layer }, options)

    await this.barrelService.addExport(barrelPath, `${layerNames.pascal}Api`)
    this.logger.updated(barrelPath)
  }
}
