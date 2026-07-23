import { BaseGenerator, type GeneratorOptions } from './BaseGenerator.js'

export class MiddlewareGenerator extends BaseGenerator {
  async generate(options: GeneratorOptions): Promise<void> {
    const names = this.resolveNames(options.name)
    const fileName = `${names.kebab}.ts`
    const filePath = this.pathResolver.layerPath(options.layer, this.pathResolver.appDir('middleware'), fileName)

    await this.generateFile(filePath, 'middleware', { ...names, layer: options.layer }, options)
  }
}
