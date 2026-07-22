import { BaseGenerator } from './BaseGenerator.js';
export class PluginGenerator extends BaseGenerator {
    async generate(options) {
        const names = this.resolveNames(options.name);
        const fileName = `${names.kebab}.ts`;
        const filePath = this.pathResolver.layerPath(options.layer, 'app/plugins', fileName);
        await this.generateFile(filePath, 'plugin', { ...names, layer: options.layer }, options);
    }
}
//# sourceMappingURL=PluginGenerator.js.map