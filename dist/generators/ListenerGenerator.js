import { BaseGenerator } from './BaseGenerator.js';
export class ListenerGenerator extends BaseGenerator {
    async generate(options) {
        const names = this.resolveNames(options.name);
        const filePath = this.pathResolver.layerPath(options.layer, 'application/usecases', `${names.pascal}Listener.ts`);
        const barrelPath = this.pathResolver.layerPath(options.layer, 'application/usecases', 'index.ts');
        await this.generateFile(filePath, 'listener', { ...names, layer: options.layer }, options);
        await this.barrelService.addExport(barrelPath, `${names.pascal}Listener`);
        this.logger.updated(barrelPath);
    }
}
//# sourceMappingURL=ListenerGenerator.js.map