import { BaseGenerator } from './BaseGenerator.js';
export class ModelGenerator extends BaseGenerator {
    async generate(options) {
        const names = this.resolveNames(options.name);
        const filePath = this.pathResolver.layerPath(options.layer, 'domain/entities', `${names.pascal}.ts`);
        const barrelPath = this.pathResolver.layerPath(options.layer, 'domain/entities', 'index.ts');
        await this.generateFile(filePath, 'model', { ...names, layer: options.layer }, options);
        await this.barrelService.addExport(barrelPath, names.pascal);
        this.logger.updated(barrelPath);
    }
}
//# sourceMappingURL=ModelGenerator.js.map