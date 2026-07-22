import { BaseGenerator } from './BaseGenerator.js';
export class UseCaseGenerator extends BaseGenerator {
    async generate(options) {
        const names = this.resolveNames(options.name);
        const filePath = this.pathResolver.layerPath(options.layer, 'application/usecases', `${names.pascal}UseCase.ts`);
        const barrelPath = this.pathResolver.layerPath(options.layer, 'application/usecases', 'index.ts');
        await this.generateFile(filePath, 'usecase', { ...names, layer: options.layer }, options);
        await this.barrelService.addExport(barrelPath, `${names.pascal}UseCase`);
        this.logger.updated(barrelPath);
    }
}
//# sourceMappingURL=UseCaseGenerator.js.map