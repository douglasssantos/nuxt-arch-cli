import { BaseGenerator } from './BaseGenerator.js';
export class ComposableGenerator extends BaseGenerator {
    async generate(options) {
        const names = this.resolveNames(options.name);
        const fileName = `use${names.pascal}.ts`;
        const filePath = this.pathResolver.layerPath(options.layer, 'app/composables', fileName);
        const barrelPath = this.pathResolver.layerPath(options.layer, 'app/composables', 'index.ts');
        await this.generateFile(filePath, 'composable', { ...names, layer: options.layer }, options);
        await this.barrelService.addExport(barrelPath, `use${names.pascal}`);
        this.logger.updated(barrelPath);
    }
}
//# sourceMappingURL=ComposableGenerator.js.map