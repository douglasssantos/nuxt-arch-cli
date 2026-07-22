export class EventsSyncCommand {
    generator;
    logger;
    options;
    constructor(generator, logger, options = {}) {
        this.generator = generator;
        this.logger = logger;
        this.options = options;
    }
    async execute() {
        try {
            await this.generator.sync(this.options);
        }
        catch (error) {
            this.logger.error(`events:sync failed: ${error.message}`);
            process.exit(1);
        }
    }
}
//# sourceMappingURL=EventsSyncCommand.js.map