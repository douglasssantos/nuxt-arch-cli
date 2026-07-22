import { Validator } from '../../utils/Validator.js';
export class EventsListenerCommand {
    name;
    generator;
    logger;
    options;
    constructor(name, generator, logger, options = {}) {
        this.name = name;
        this.generator = generator;
        this.logger = logger;
        this.options = options;
    }
    async execute() {
        try {
            Validator.assertNonEmpty(this.name, 'Listener name');
            await this.generator.generate(this.name, this.options);
        }
        catch (error) {
            this.logger.error(`events:listener failed: ${error.message}`);
            process.exit(1);
        }
    }
}
//# sourceMappingURL=EventsListenerCommand.js.map