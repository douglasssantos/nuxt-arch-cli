import { BaseGenerator } from './BaseGenerator.js';
export class RepositoryGenerator extends BaseGenerator {
    async generate(options) {
        const names = this.resolveNames(options.name);
        // Domain interface
        const interfacePath = this.pathResolver.layerPath(options.layer, 'domain/repositories', `I${names.pascal}Repository.ts`);
        await this.generateFile(interfacePath, 'repository', { ...names, layer: options.layer }, options);
        // Infrastructure implementation
        const implPath = this.pathResolver.layerPath(options.layer, 'infrastructure/repositories', `${names.pascal}Repository.ts`);
        await this.generateFile(implPath, 'repository-impl', { ...names, layer: options.layer }, options);
        // Update barrel files
        const domainBarrel = this.pathResolver.layerPath(options.layer, 'domain/repositories', 'index.ts');
        const infraBarrel = this.pathResolver.layerPath(options.layer, 'infrastructure/repositories', 'index.ts');
        await this.barrelService.addExport(domainBarrel, `I${names.pascal}Repository`);
        await this.barrelService.addExport(infraBarrel, `${names.pascal}Repository`);
        this.logger.updated(domainBarrel);
        this.logger.updated(infraBarrel);
    }
}
//# sourceMappingURL=RepositoryGenerator.js.map