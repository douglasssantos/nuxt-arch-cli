import { BaseGenerator } from './BaseGenerator.js';
export class InterfaceGenerator extends BaseGenerator {
    async generate(options) {
        const names = this.resolveNames(options.name);
        const filePath = this.pathResolver.layerPath(options.layer, 'domain/contracts', `${names.pascal}.ts`);
        const barrelPath = this.pathResolver.layerPath(options.layer, 'domain/contracts', 'index.ts');
        await this.generateFile(filePath, 'interface', { ...names, layer: options.layer }, options);
        await this.barrelService.addExport(barrelPath, names.pascal);
        this.logger.updated(barrelPath);
    }
}
//# sourceMappingURL=InterfaceGenerator.js.map