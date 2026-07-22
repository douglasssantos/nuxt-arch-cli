import { BaseGenerator } from './BaseGenerator.js';
export class StoreGenerator extends BaseGenerator {
    async generate(options) {
        const names = this.resolveNames(options.name);
        const filePath = this.pathResolver.layerPath(options.layer, 'infrastructure/stores', `${names.pascal}Store.ts`);
        const barrelPath = this.pathResolver.layerPath(options.layer, 'infrastructure/stores', 'index.ts');
        await this.generateFile(filePath, 'store', { ...names, layer: options.layer }, options);
        await this.barrelService.addExport(barrelPath, `${names.pascal}Store`);
        this.logger.updated(barrelPath);
    }
}
//# sourceMappingURL=StoreGenerator.js.map