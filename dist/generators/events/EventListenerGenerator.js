import path from 'node:path';
import { NameResolver } from '../../utils/NameResolver.js';
import { FileReader } from '../../utils/FileReader.js';
export class EventListenerGenerator {
    fileService;
    templateService;
    formatterService;
    barrelService;
    logger;
    constructor(fileService, templateService, formatterService, barrelService, logger) {
        this.fileService = fileService;
        this.templateService = templateService;
        this.formatterService = formatterService;
        this.barrelService = barrelService;
        this.logger = logger;
    }
    async generate(listenerName, options = {}) {
        const names = NameResolver.resolve(listenerName);
        const cwd = options.cwd ?? process.cwd();
        const className = names.pascal.endsWith('Listener') ? names.pascal : `${names.pascal}Listener`;
        const eventPascal = options.eventName
            ? NameResolver.resolve(options.eventName).pascal
            : names.pascal.replace(/Listener$/, '');
        const eventKey = options.eventKey ?? NameResolver.resolve(eventPascal).kebab;
        const { kind, listenersDir, targetLabel } = await this.resolveTarget(cwd, options);
        const filePath = path.join(listenersDir, `${className}.ts`);
        const barrelPath = path.join(listenersDir, 'index.ts');
        const ctx = {
            pascalName: className,
            camelName: names.camel,
            kebabName: names.kebab,
            snakeName: names.snake,
            upperName: names.upper,
            eventPascal,
            eventKey,
            layer: targetLabel,
        };
        const template = kind === 'layer' ? 'events/layer-listener'
            : kind === 'module' ? 'events/module-listener'
                : 'events/listener';
        const raw = await this.templateService.render(template, ctx);
        const formatted = await this.formatterService.formatTypeScript(raw);
        await this.fileService.safeWrite(filePath, formatted, {
            force: options.force,
            onWrite: () => this.logger.created(filePath),
            onSkip: () => this.logger.skipped(filePath, 'already exists'),
        });
        await this.barrelService.addExport(barrelPath, className);
        this.logger.updated(barrelPath);
    }
    async resolveTarget(cwd, options) {
        if (!options.target) {
            const eventsRoot = path.join(cwd, options.eventsRoot ?? 'core/events');
            return { kind: 'global', listenersDir: path.join(eventsRoot, 'listeners'), targetLabel: '' };
        }
        const target = NameResolver.resolve(options.target);
        const layerPath = path.join(cwd, options.layersDir ?? 'layers', target.kebab);
        const modulePath = path.join(cwd, options.modulesDir ?? 'modules', target.kebab);
        // Explicit kind overrides filesystem detection
        if (options.targetKind === 'layer') {
            return {
                kind: 'layer',
                listenersDir: path.join(layerPath, 'application', 'usecases'),
                targetLabel: target.kebab,
            };
        }
        if (options.targetKind === 'module') {
            return {
                kind: 'module',
                listenersDir: path.join(modulePath, 'listeners'),
                targetLabel: target.kebab,
            };
        }
        // Auto-detect: check layer first, then module
        if (await FileReader.exists(layerPath)) {
            return {
                kind: 'layer',
                listenersDir: path.join(layerPath, 'application', 'usecases'),
                targetLabel: target.kebab,
            };
        }
        if (await FileReader.exists(modulePath)) {
            return {
                kind: 'module',
                listenersDir: path.join(modulePath, 'listeners'),
                targetLabel: target.kebab,
            };
        }
        return {
            kind: 'module',
            listenersDir: path.join(cwd, options.modulesDir ?? 'modules', target.kebab, 'listeners'),
            targetLabel: target.kebab,
        };
    }
}
//# sourceMappingURL=EventListenerGenerator.js.map