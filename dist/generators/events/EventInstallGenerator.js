import path from 'node:path';
import { FileWriter } from '../../utils/FileWriter.js';
export class EventInstallGenerator {
    fileService;
    templateService;
    formatterService;
    logger;
    constructor(fileService, templateService, formatterService, logger) {
        this.fileService = fileService;
        this.templateService = templateService;
        this.formatterService = formatterService;
        this.logger = logger;
    }
    async generate(options = {}) {
        const cwd = options.cwd ?? process.cwd();
        const root = path.join(cwd, options.eventsRoot ?? 'core/events');
        this.logger.title('Installing Event Bus infrastructure');
        // Create all directories
        await FileWriter.ensureDirs([
            path.join(root, 'contracts'),
            path.join(root, 'services'),
            path.join(root, 'composables'),
            path.join(root, 'plugins'),
            path.join(root, 'events'),
            path.join(root, 'listeners'),
            path.join(root, 'registry'),
        ]);
        const ctx = { pascalName: '', camelName: '', kebabName: '', snakeName: '', upperName: '' };
        const files = [
            { dest: path.join(root, 'contracts', 'IEventBus.ts'), template: 'events/install/contracts-event-bus' },
            { dest: path.join(root, 'contracts', 'IEventHandler.ts'), template: 'events/install/contracts-event-handler' },
            { dest: path.join(root, 'services', 'SimpleEventBus.ts'), template: 'events/install/services-simple-event-bus' },
            { dest: path.join(root, 'composables', 'useEventBus.ts'), template: 'events/install/composables-use-event-bus' },
            { dest: path.join(root, 'plugins', 'event-bus.ts'), template: 'events/install/plugin' },
            { dest: path.join(root, 'EventMap.ts'), template: 'events/install/event-map' },
            { dest: path.join(root, 'EventRegistry.ts'), template: 'events/install/event-registry' },
            { dest: path.join(root, 'index.ts'), template: 'events/install/index' },
        ];
        for (const f of files) {
            const raw = await this.templateService.render(f.template, ctx);
            const formatted = await this.formatterService.formatTypeScript(raw);
            await this.fileService.safeWrite(f.dest, formatted, {
                force: options.force,
                onWrite: () => this.logger.created(f.dest),
                onSkip: () => this.logger.skipped(f.dest, 'already exists'),
            });
        }
        this.logger.newLine();
        this.logger.success(`Event Bus installed at ${options.eventsRoot ?? 'core/events'}/`);
        this.logger.info('Add the plugin to nuxt.config.ts → plugins: ["./core/events/plugins/event-bus"]');
    }
}
//# sourceMappingURL=EventInstallGenerator.js.map