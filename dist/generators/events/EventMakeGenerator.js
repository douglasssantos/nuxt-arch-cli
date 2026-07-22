import path from 'node:path';
import { NameResolver } from '../../utils/NameResolver.js';
import { FileReader } from '../../utils/FileReader.js';
export class EventMakeGenerator {
    fileService;
    templateService;
    formatterService;
    barrelService;
    eventsService;
    logger;
    constructor(fileService, templateService, formatterService, barrelService, eventsService, logger) {
        this.fileService = fileService;
        this.templateService = templateService;
        this.formatterService = formatterService;
        this.barrelService = barrelService;
        this.eventsService = eventsService;
        this.logger = logger;
    }
    async generate(eventName, options = {}) {
        const names = NameResolver.resolve(eventName);
        const cwd = options.cwd ?? process.cwd();
        const { kind, eventsDir, targetLabel } = await this.resolveTarget(cwd, options);
        const namespace = options.namespace ?? options.target ?? '';
        const eventKey = namespace ? `${namespace}:${names.kebab}` : names.kebab;
        const filePath = path.join(eventsDir, `${names.pascal}.ts`);
        const barrelPath = path.join(eventsDir, 'index.ts');
        const ctx = {
            pascalName: names.pascal,
            camelName: names.camel,
            kebabName: names.kebab,
            snakeName: names.snake,
            upperName: names.upper,
            namespace,
            eventKey,
            layer: targetLabel,
        };
        const template = kind === 'layer' ? 'events/layer-event'
            : kind === 'module' ? 'events/module-event'
                : 'events/event';
        const raw = await this.templateService.render(template, ctx);
        const formatted = await this.formatterService.formatTypeScript(raw);
        await this.fileService.safeWrite(filePath, formatted, {
            force: options.force,
            onWrite: () => this.logger.created(filePath),
            onSkip: () => this.logger.skipped(filePath, 'already exists'),
        });
        await this.barrelService.addExport(barrelPath, names.pascal);
        this.logger.updated(barrelPath);
        // Update global EventMap if core/events exists
        const globalEventsRoot = path.join(cwd, options.eventsRoot ?? 'core/events');
        const eventMapPath = path.join(globalEventsRoot, 'EventMap.ts');
        if (await FileReader.exists(eventMapPath)) {
            const allEvents = await this.eventsService.scanEventsAll(cwd, {
                layersDir: options.layersDir ?? 'layers',
                modulesDir: options.modulesDir ?? 'modules',
                eventsRoot: options.eventsRoot ?? 'core/events',
            });
            await this.eventsService.updateEventMap(eventMapPath, allEvents);
            this.logger.updated(eventMapPath);
        }
    }
    async resolveTarget(cwd, options) {
        if (!options.target) {
            const eventsRoot = path.join(cwd, options.eventsRoot ?? 'core/events');
            return { kind: 'global', eventsDir: path.join(eventsRoot, 'events'), targetLabel: '' };
        }
        const target = NameResolver.resolve(options.target);
        const layerPath = path.join(cwd, options.layersDir ?? 'layers', target.kebab);
        const modulePath = path.join(cwd, options.modulesDir ?? 'modules', target.kebab);
        // Explicit kind overrides filesystem detection
        if (options.targetKind === 'layer') {
            return {
                kind: 'layer',
                eventsDir: path.join(layerPath, 'domain', 'contracts'),
                targetLabel: target.kebab,
            };
        }
        if (options.targetKind === 'module') {
            return {
                kind: 'module',
                eventsDir: path.join(modulePath, 'events'),
                targetLabel: target.kebab,
            };
        }
        // Auto-detect
        if (await FileReader.exists(layerPath)) {
            return {
                kind: 'layer',
                eventsDir: path.join(layerPath, 'domain', 'contracts'),
                targetLabel: target.kebab,
            };
        }
        if (await FileReader.exists(modulePath)) {
            return {
                kind: 'module',
                eventsDir: path.join(modulePath, 'events'),
                targetLabel: target.kebab,
            };
        }
        return {
            kind: 'module',
            eventsDir: path.join(cwd, options.modulesDir ?? 'modules', target.kebab, 'events'),
            targetLabel: target.kebab,
        };
    }
}
//# sourceMappingURL=EventMakeGenerator.js.map