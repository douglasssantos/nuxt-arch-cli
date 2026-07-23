import { BaseGenerator, type GeneratorOptions } from './BaseGenerator.js'

export class PageGenerator extends BaseGenerator {
  async generate(options: GeneratorOptions): Promise<void> {
    const names = this.resolveNames(options.name)
    const fileName = `${names.kebab}.vue`
    const filePath = this.pathResolver.layerPath(options.layer, this.pathResolver.appDir('pages'), fileName)

    await this.generateFile(
      filePath,
      'page',
      { ...names, layer: options.layer },
      { ...options, vue: true },
    )
  }
}
