import { BaseGenerator } from './BaseGenerator.js';
export class EventGenerator extends BaseGenerator {
    async generate(options) {
        const names = this.resolveNames(options.name);
        // Strip trailing 'Event' suffix to avoid duplication (e.g. OrderCreatedEvent → OrderCreated → OrderCreatedEvent.ts)
        const baseName = names.pascal.endsWith('Event')
            ? names.pascal.slice(0, -5)
            : names.pascal;
        const baseNames = this.resolveNames(baseName);
        const filePath = this.pathResolver.layerPath(options.layer, 'domain/contracts', `${baseNames.pascal}Event.ts`);
        const barrelPath = this.pathResolver.layerPath(options.layer, 'domain/contracts', 'index.ts');
        await this.generateFile(filePath, 'event', { ...baseNames, layer: options.layer }, options);
        await this.barrelService.addExport(barrelPath, `${baseNames.pascal}Event`);
        this.logger.updated(barrelPath);
    }
}
//# sourceMappingURL=EventGenerator.js.map