export class EventsInstallCommand {
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
            await this.generator.generate(this.options);
        }
        catch (error) {
            this.logger.error(`events:install failed: ${error.message}`);
            process.exit(1);
        }
    }
}
//# sourceMappingURL=EventsInstallCommand.js.map