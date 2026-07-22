import chalk from 'chalk';
export class EventsListCommand {
    eventsService;
    logger;
    options;
    constructor(eventsService, logger, options = {}) {
        this.eventsService = eventsService;
        this.logger = logger;
        this.options = options;
    }
    async execute() {
        const cwd = this.options.cwd ?? process.cwd();
        const scanOptions = {
            eventsRoot: this.options.eventsRoot ?? 'core/events',
            layersDir: this.options.layersDir ?? 'layers',
            modulesDir: this.options.modulesDir ?? 'modules',
        };
        try {
            const events = await this.eventsService.scanEventsAll(cwd, scanOptions);
            const listeners = await this.eventsService.scanListenersAll(cwd, scanOptions);
            if (events.length === 0) {
                this.logger.warn('No events found. Run "app events:make <name>" to create one.');
                return;
            }
            console.log();
            console.log(chalk.bold.cyan('  Registered Events'));
            console.log();
            for (const event of events) {
                const eventListeners = listeners.filter((l) => l.handlesEventClass === event.name);
                console.log(`  ${chalk.green('✔')} ${chalk.white(event.key)} ${chalk.gray(`(${event.name})`)}`);
                if (eventListeners.length === 0) {
                    console.log(`      ${chalk.gray('— no listeners')}`);
                }
                else {
                    for (const listener of eventListeners) {
                        console.log(`      ${chalk.cyan('›')} ${listener.className}`);
                    }
                }
                console.log();
            }
            console.log(chalk.gray(`  ${events.length} event(s), ${listeners.length} listener(s) total.`));
            console.log();
        }
        catch (error) {
            this.logger.error(`events:list failed: ${error.message}`);
            process.exit(1);
        }
    }
}
//# sourceMappingURL=EventsListCommand.js.map