import { BaseGenerator } from './BaseGenerator.js';
export class PageGenerator extends BaseGenerator {
    async generate(options) {
        const names = this.resolveNames(options.name);
        const fileName = `${names.kebab}.vue`;
        const filePath = this.pathResolver.layerPath(options.layer, 'app/pages', fileName);
        await this.generateFile(filePath, 'page', { ...names, layer: options.layer }, { ...options, vue: true });
    }
}
//# sourceMappingURL=PageGenerator.js.map