import { BaseGenerator } from './BaseGenerator.js';
export class MiddlewareGenerator extends BaseGenerator {
    async generate(options) {
        const names = this.resolveNames(options.name);
        const fileName = `${names.kebab}.ts`;
        const filePath = this.pathResolver.layerPath(options.layer, 'app/middleware', fileName);
        await this.generateFile(filePath, 'middleware', { ...names, layer: options.layer }, options);
    }
}
//# sourceMappingURL=MiddlewareGenerator.js.map