import { BaseGenerator } from './BaseGenerator.js';
export class EnumGenerator extends BaseGenerator {
    async generate(options) {
        const names = this.resolveNames(options.name);
        const filePath = this.pathResolver.layerPath(options.layer, 'domain/contracts', `${names.pascal}.ts`);
        const barrelPath = this.pathResolver.layerPath(options.layer, 'domain/contracts', 'index.ts');
        await this.generateFile(filePath, 'enum', { ...names, layer: options.layer }, options);
        await this.barrelService.addExport(barrelPath, names.pascal);
        this.logger.updated(barrelPath);
    }
}
//# sourceMappingURL=EnumGenerator.js.map