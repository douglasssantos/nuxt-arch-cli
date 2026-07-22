import { BaseGenerator } from './BaseGenerator.js';
export class ComponentGenerator extends BaseGenerator {
    async generate(options) {
        const names = this.resolveNames(options.name);
        const fileName = `${names.pascal}.vue`;
        const filePath = this.pathResolver.layerPath(options.layer, 'app/components', fileName);
        await this.generateFile(filePath, 'component', { ...names, layer: options.layer }, { ...options, vue: true });
    }
}
//# sourceMappingURL=ComponentGenerator.js.map