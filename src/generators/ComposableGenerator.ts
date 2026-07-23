import { BaseGenerator, type GeneratorOptions } from './BaseGenerator.js'

export class ComposableGenerator extends BaseGenerator {
  async generate(options: GeneratorOptions): Promise<void> {
    const names = this.resolveNames(options.name)
    const fileName = `use${names.pascal}.ts`
    const filePath = this.pathResolver.layerPath(options.layer, this.pathResolver.appDir('composables'), fileName)
    const barrelPath = this.pathResolver.layerPath(options.layer, this.pathResolver.appDir('composables'), 'index.ts')

    await this.generateFile(filePath, 'composable', { ...names, layer: options.layer }, options)

    await this.barrelService.addExport(barrelPath, `use${names.pascal}`)
    this.logger.updated(barrelPath)
  }
}
