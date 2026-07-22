import { BaseGenerator, type GeneratorOptions } from './BaseGenerator.js'

export class PluginGenerator extends BaseGenerator {
  async generate(options: GeneratorOptions): Promise<void> {
    const names = this.resolveNames(options.name)
    const fileName = `${names.kebab}.ts`
    const filePath = this.pathResolver.layerPath(options.layer, 'app/plugins', fileName)

    await this.generateFile(filePath, 'plugin', { ...names, layer: options.layer }, options)
  }
}
